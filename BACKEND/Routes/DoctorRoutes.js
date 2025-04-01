const express = require("express");
const router = express.Router();
//Insert Model
const Doctor = require("../Model/DoctorModel");
//Insert Doctor Controller
const DoctorController = require("../Controller/DoctorControllers");

router.get("/",DoctorController.getAllDoctors);
router.post("/",DoctorController.addDoctors);
router.get("/:id",DoctorController.getById);
router.put("/:id",DoctorController.updateDoctor);
router.delete("/:id",DoctorController.deleteDoctor);

//export
module.exports = router;