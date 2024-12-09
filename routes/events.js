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
        .then((event) => res.json(event))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/", (req, res) => {
  // Récupérer tous les événements
  Event.find().then((events) => res.json(events));
});

router.get("/likedEvents/:userToken", (req, res) => {});

router.get("/createdEvents/:userToken", (req, res) => {});

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

router.get("/event", (req, res) => {});

router.delete("/deleteEvent/:userToken", (req, res) => {
  // Supprimer un événement si l'utilisateur est l'auteur
  Event.findById(req.params.id)
    .then((event) => {
      event.remove().then(() => res.json({ success: true }));
    })
    .catch((err) => res.status(404).json({ eventnotfound: "No event found" }));
});

module.exports = router;
