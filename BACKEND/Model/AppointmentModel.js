const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  petName: {
    type: String,
    required: true,
  },
  petType: {
    type: String,
    required: true,
  },
  petAge: {
    type: Number,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "AppointmentModel", //file name
  appointmentSchema //funtion name
);
