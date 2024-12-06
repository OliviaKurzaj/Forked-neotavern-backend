var express = require("express");
var router = express.Router();

const Place = require("../models/places");

router.post("/createPlace", (req, res) => {});

router.get("/", (req, res) => {});

router.get("/:placeName", (req, res) => {});

router.delete("/deletePlace/:userToken", (req, res) => {});

router.put("/updatePlace/:userToken", (req, res) => {});

module.exports = router;
