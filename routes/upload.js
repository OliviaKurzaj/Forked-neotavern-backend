var express = require("express");
var router = express.Router();

const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: 'NeoTavern',
  api_key: '152214396549431',
  api_secret: 'xC-egnhwZGrPTSv7lyrBXbhRrjE@dqlhuizaf',
});

// route pour upload la photo depuis le front vers le cloud
router.post("/", async (req, res) => {
  console.log("CA FONCTIONNE !!"); // verification que la route fonctionne
  const photoPath = `./tmp/${uniqid()}.jpg`; // on ajoute un id unique à l'image et on stock dans le dossier temporaire
  const resultMove = await req.files.photoFromFront.mv(photoPath); // fichier upload receptionné
  const resultCloudinary = await cloudinary.uploader.upload(photoPath); // upload (depuis tmp) qui renverra une URL unique et immuable dans "secure_url"

  if (!resultMove) {
    fs.unlinkSync(photoPath); // on supprime le fichier temporaire ${uniqid()}.jpg après l’upload vers Cloudinary
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
});

module.exports = router;
