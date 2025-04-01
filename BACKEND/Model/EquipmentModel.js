const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  eqName: {
    type: String, //datatype
    required: true, //validate
  },
  eqId: {
    type: String, //datatype
    required: true, //validate
  },
  qty: {
    type: Number, //datatype
    required: true, //validate
  },
  issuedDate: {
    type: String, //datatype
    required: true, //validate
  },
});

module.exports = mongoose.model(
  "EquipmentModel", //filename
  equipmentSchema //function name
);