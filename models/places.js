const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: String,
  address: String,
  city: String,
  postcode: String,
  date: String, // horaires d'ouverture
  description: String,
  type: String,
  website: String,
  vegan: Boolean,
  vegetarian: Boolean,
  longitude: Number,
  latitude: Number,
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Place = mongoose.model("places", placeSchema);

module.exports = Place;
