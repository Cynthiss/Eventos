// backend/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  place: String,
  guests: Number,
  price: Number,
  type: String, // "public" o "private"
});

module.exports = mongoose.model("Event", eventSchema);
