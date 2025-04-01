const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    doctorId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    specializedField:{
        type:String,
        required:true,
    },
    assignedPatients:{
        type:String,
        required:true,
    },
    availableSlot:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model(
    "DoctorModel",//file name
    doctorSchema //function name
);
    