const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: String,
  address: String,
  city: String,
  postcode: String,
  date: Date, // horaires d'ouverture
  description: String,
  website: String,
  vegan: Boolean,
  vegetarian: Boolean,
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
