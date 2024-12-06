var express = require("express");
var router = express.Router();

const User = require("../models/users");

router.post("/signup", (req, res) => {});

router.post("/login", (req, res) => {});

router.delete("/deleteUser/:userToken", (req, res) => {});

router.put("/updateUser/:userToken", (req, res) => {});

module.exports = router;
