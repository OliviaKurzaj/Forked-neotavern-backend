var express = require("express");
var router = express.Router();

const Event = require("../models/events");

router.post("/createEvent/:userToken", (req, res) => {});

router.get("/", (req, res) => {});

router.get("/likedEvents/:userToken", (req, res) => {});

router.get("/createdEvents/:userToken", (req, res) => {});

router.get("/event/:eventInfos", (req, res) => {});

router.get("/event", (req, res) => {});

router.delete("/deleteEvent/:userToken", (req, res) => {});

module.exports = router;
