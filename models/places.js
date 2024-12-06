const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: String,
  address: String,
  date: Date,
  description: String,
  website: String,
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
