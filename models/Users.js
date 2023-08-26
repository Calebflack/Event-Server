const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  nom: {
    type: String,
    //required: true,
  },
  prenom: {
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
  telephone: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    //required: true,
  },
  mdp: {
    type: String,
    //required: true,
  },
  profilImage: {
    type: String,
    //required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
