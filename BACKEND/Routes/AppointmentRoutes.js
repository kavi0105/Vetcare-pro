const express = require("express");
const router = express.Router();
//Insert Model
const Appointment = require("../Model/AppointmentModel");
//Insert user controller
const AppointmentController = require("../Controller/AppointmentControllers");


router.get("/",AppointmentController.getAllAppointment);
router.post("/",AppointmentController.addAppointment);
router.get("/:id",AppointmentController.getByIdAppointment);
router.put("/:id",AppointmentController.updateAppointment);
router.delete("/:id",AppointmentController.deleteAppointment);

//export
module.exports = router;