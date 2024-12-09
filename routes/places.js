var express = require("express");
var router = express.Router();

const Place = require("../models/places");
require('../models/connection');

const NEO_API_KEY = process.env.NEO_API_KEY;

// Création d'une route POST pour pouvoir créer un établissement
router.post("/createPlace", (req, res) => {
    // le module checkbody va permettre de vérifier que le champ remplis n'est ni vide, ni égal à zéro, ni null, ni undefined.
    if (!checkBody(req.body, ['name', 'address', 'postcode', 'city', 'date', 'description', 'website'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
      }

      // création de l'établissement et vérification qu'il n'a pas déjà été créé
        // RegExp permet de vérifier l'insensibilité à la casse (maj et sans maj)
    Place.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } }).then(data => {
    if (data === null) { // l'établissement n'existe pas

            const newPlace = new Place({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            postcode: req.body.postcode,
            date: req.body.date,
            description: req.body.description,
            vegan: req.body.vegan,
            vegetarian: req.body.vegetarian,
            website: JSON.stringify(req.body.website),
            // events: req.body.events,
            // user: req.body.user
            });
    
            newPlace.save().then(newPlace => { // sauvegarde de l'établissement dans la BDD
            res.json({ result: true, newPlace });
            });

    } else {
        // L'établissement existe déjà!
        res.json({ result: false, error: `Oups, l'établissement a déjà été créé!` });
    }
    });
});


router.get("/", (req, res) => {});

router.get("/:placeName", (req, res) => {});

router.delete("/deletePlace/:userToken", (req, res) => {});

router.put("/updatePlace/:userToken", (req, res) => {});

module.exports = router;