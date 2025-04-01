const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
  petName: {
    type: String,
    required: true,
  },
  petAge: {
    type: Number,
    required: true,
  },
  petType: {
    type: String,
    required: true,
  },
  petBreed: {
    type: String,
    required: true,
  },
  vaccineDates: {
    type: String,
    required: true,
  },
  petOwnerName: {
    type: String,
    required: true,
  },
  ownerContactNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model(
  "PetModel", //file name
  petSchema //function name
);
