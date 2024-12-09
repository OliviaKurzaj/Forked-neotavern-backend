var express = require("express");
var router = express.Router();

const Event = require("../models/events");

router.post("/createEvent/:userToken", (req, res) => {
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

router.get("/event/:eventInfos", (req, res) => {
  // Afficher des événements après une recherche
  Event.find({ name: req.params.eventInfos }).then((event) => {
    res.json(event);

    if (res.json(event) === null) {
      Event.find({ description: req.params.eventInfos }).then((event) => {
        res.json(event);
      });
    } else {
      res.json({ message: "No event found" });
    }
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
