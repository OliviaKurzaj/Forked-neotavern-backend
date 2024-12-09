var express = require("express");
var router = express.Router();

const Event = require("../models/events");

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
        mainCategory: req.body.mainCategory,
        likes: req.body.likes,
        categories: req.body.categories,
        infosTags: req.body.infosTags,
        place: req.body.place,
        user: req.body.user,
      });

      newEvent
        .save()
        .then((savedEvent) => {
          return Event.findById(savedEvent._id)
            .populate("place")
            .populate("user", "token");
        })
        .then((populatedEvent) => res.json(populatedEvent))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/", (req, res) => {
  // Récupérer tous les événements
  Event.find().then((events) => res.json(events));
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

  Event.findById(eventId).then((event) => {
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

router.get("/event", (req, res) => {});

router.get("/likedEvents/:userToken", (req, res) => {});

router.get("/createdEvents/:userToken", (req, res) => {});

module.exports = router;
