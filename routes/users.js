var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Event = require("../models/events")

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//vérification du champs de saisie
const { checkBody } = require('../modules/checkBody');

// route post/signup => création utilisateur en bdd :
router.post("/signup", (req, res) => {
    if (!checkBody(req.body, [ 'email', 'password', 'nickname'])) {
        res.json({ result: false, error: 'Champs manquants ou vides' });
            return;
    }
	
	User.findOne({nickname: req.body.nickname})
    // .populate('events')
    .then(dbData => {
		if(dbData){
			res.json({result: false, error:`Ce surnom est déjà existant`})
		}
		else{
            const hash = bcrypt.hashSync(req.body.password, 10);
            
			const newUser = new User({
                nickname: req.body.nickname,
                email: req.body.email,
                password: hash,
                role: req.body.role,
                token: uid2(32),
                likedEvents: [],
                postedEvents: [],
                badges: req.body.badge,
			})
			newUser.save().then(newData => {
				res.json({result: true, userData:newData})
			})
		}
	})
})

// route post/login => connexion utilisateur par mail et mdp :
router.post("/login", (req, res) => {

    //vérification du champs de saisie 
    if (!checkBody(req.body, [ 'username', 'password', 'nickname'])) {
		res.json({ result: false, error: 'Champs manquants ou vides' });
			return;
		}

    User.findOne({email:req.body.email})
    .then(dbData => {
        if (dbData && bcrypt.compareSync(req.body.password, dbData.password)){
            res.json({ result: true, userData:dbData });
        } else {
        res.json({result: false, error:'Mauvais email et/ou mot de passe'})
        }
    })
});


//route delete/:userToken => suppression utilisateur via params token :
router.delete("/deleteUser/:userToken", (req, res) => {
    User.deleteOne({token: req.params.token})
    res.json({result: true, message:'Compte surpprimé !'})
});

//route  put/:userToken => modification données utilisateur via params token :
router.put("/updateUser/:userToken", (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    User.updateOne({token: req.params.token}, { nickname: req.body.nickname,         password: hash}).then(() => {
        User.find().then(updateData => {
            res.json({result:true, message:'Modifications enregistrées !', updateData})        
            });
    });
});

module.exports = router;
