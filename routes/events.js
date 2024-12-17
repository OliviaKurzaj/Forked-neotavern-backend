var express = require("express");
var router = express.Router();

const Event = require("../models/events");
const User = require("../models/users");

router.post("/createEvent/", (req, res) => {
  // Créer un événement
  Event.findOne({ name: req.body.name }).then((event) => {
    if (event) {
      return res.status(400).json({ name: "Event already exists" });
    } else {
      const newEvent = new Event({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        hour: req.body.hour,
        likes: req.body.likes,
        categories: req.body.categories,
        photo: req.body.photo,
        infosTags: req.body.infosTags,
        place: req.body.place,
        user: req.body.user,
      });

      newEvent
        .save()
        .then((savedEvent) => {
          return Event.findById(savedEvent._id)
            .populate("user")
            .populate("place");
        })
        .then((populatedEvent) => res.json(populatedEvent))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/", (req, res) => {
  // Récupérer tous les événements
  Event.find()
    .populate("user")
    .populate("place")
    .then((events) => res.json(events));
});

router.get("/:eventInfos", (req, res) => {
  // Rechercher un événement par nom ou description
  const searchTerm = req.params.eventInfos;

  Event.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .then((events) => {
      if (events.length > 0) {
        res.json(events);
      } else {
        res.status(404).json({ message: "No event found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/deleteEvent/:userToken", (req, res) => {
  const { userToken } = req.params;
  const { eventId } = req.body;

  if (!userToken) {
    return res.status(400).json({ message: "User token is required" });
  }

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  Event.findById(eventId)
    .populate("user")
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.user.token !== userToken) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      Event.findByIdAndDelete(eventId)
        .then(() => {
          res.json({ message: "Event deleted successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });
});

// Route pour récupérer les événements créés par un utilisateur
router.get("/createdEvents/:userToken", (req, res) => {
  const { userToken } = req.params;

  if (!userToken) {
    return res.status(400).json({ message: "User token is required" });
  }

  Event.find({ user: userToken })
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Route pour liker et disliker un événement par le token de l'utilisateur
router.put("/like/:userToken/:eventId", async (req, res) => {
  const { userToken, eventId } = req.params;

  try {
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (user.likedEvents.includes(eventId)) {
      // Dislike
      if (event.likes > 0) {
        await User.updateOne(
          { token: userToken },
          { $pull: { likedEvents: eventId } }
        );
        await Event.updateOne({ _id: eventId }, { $inc: { likes: -1 } });
        res.json({ message: "Event disliked successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Cannot dislike an event with 0 likes" });
      }
    } else {
      // Like
      await User.updateOne(
        { token: userToken },
        { $push: { likedEvents: eventId } }
      );
      await Event.updateOne({ _id: eventId }, { $inc: { likes: 1 } });
      res.json({ message: "Event liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour récupérer les likes d'un utilisateur
router.get("/liked-events/:userId", (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("likedEvents")
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
        throw new Error("User not found");
      }

      res.status(200).json({ likedEvents: user.likedEvents });
    })
    .catch((error) => {
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "An error occurred", error: error.message });
      }
    });
});

module.exports = router;
