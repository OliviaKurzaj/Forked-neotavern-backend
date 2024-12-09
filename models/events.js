const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  mainCategory: String,
  likes: Number,
  categories: [String],
  infosTags: [
    { food: [String] },
    { drinks: [String] },
    { price: [String] },
    { legal: [String] },
  ],
  // place: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "places",
  // },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "users",
  // },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
