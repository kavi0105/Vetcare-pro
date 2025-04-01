const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  staffId: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "StaffModel", //file name
  staffSchema //function name
);
