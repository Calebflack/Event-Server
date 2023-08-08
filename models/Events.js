const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  code: {
    type: String,
    //required: true,
  },
  titre: {
    type: String,
    //required: true,
  },
  pays: {
    type: String,
    //required: true,
  },
  ville: {
    type: String,
    //required: true,
  },
  adresse: {
    type: String,
    //required: true,
  },
  description: {
    type: String,
    //required: true,
  },
  thumbnail: {
    type: String,
    //required: true,
  },
  prix: {
    type: String,
    //required: true,
  },
  seatNum: {
    type: String,
    //required: true,
  },
  categorie: {
    type: Array,
    //required: true,
  },
  keyword: {
    type: String,
    //required: true,
  },
  debut: {
    type: String,
    // type: Date,
    // default: Date.now(),
  },
  fin: {
    type: String,
    // type: Date,
    // default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", EventSchema);
