var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Event = require("../models/events");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");

router.post("/signup", (req, res) => {
  //vérification du champs de saisie
  if (!checkBody(req.body, ["email", "password", "nickname"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  //création user
  User.findOne({ email: req.body.email }).then((dbData) => {
    if (dbData) {
      res.json({ result: false, error: `Ce mail est déjà existant` });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        nickname: req.body.nickname,
        email: req.body.email,
        password: hash,
        role: req.body.role,
        token: uid2(32),
        likedEvents: [],
        badges: req.body.badges,
      });
      newUser
        .save()
        .then((dbData) =>
          res.json({
            result: true,
            token: dbData.token,
            nickname: dbData.nickname,
            likedEvents: dbData.likedEvents,

            id: dbData._id,
            role: dbData.role,
            badges: dbData.badges,
          })
        )
        //res.json({result:true, token: dbData.token, nickname: dbData.nickname, id: dbData._id})
        // .then((savedUser)=> {
        //     return User.findOne(savedUser.token)
        //     .populate('events')
        // })
        // .then((populatedUser) =>
        // res.json({result:true, populatedUser}))
        .catch((err) => console.log(err));
    }
  });
});

router.post("/login", (req, res) => {
  //connexion user par email et mdp
  User.findOne({ email: req.body.email })
    .populate("likedEvents")
    .then((dbData) => {
      //dbData.likedEvents ==> [idevent, idevent...]
      if (dbData && bcrypt.compareSync(req.body.password, dbData.password)) {
        res.json({
          result: true,
          token: dbData.token,
          nickname: dbData.nickname,
          likedEvents: dbData.likedEvents,

          id: dbData._id,
          role: dbData.role,
          badges: dbData.badges,
        });
      } else {
        res.json({ result: false, error: "Mauvais email et/ou mot de passe" });
      }
    });
});

router.delete("/deleteUser/:token", (req, res) => {
  //suppression user via token
  User.deleteOne({ token: req.params.token }).then(
    res.json({ result: true, message: "Compte supprimé" })
  );
});

router.put("/updateUser/:token", (req, res) => {
  //maj user via token
  User.find({ token: req.params.token }).then((dbData) => {
    if (!dbData) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      User.updateOne(
        { token: req.params.token },
        { nickname: req.body.nickname } || { password: hash }
      ).then(() => {
        if (dbData)
          User.findOne({ token: req.params.token }).then((updateData) => {
            res.json({
              result: true,
              message: "Modifications enregistrées !",
              updateData,
            });
          });
      });
    } else {
      res.json({ result: false });
    }
  });
});

module.exports = router;
