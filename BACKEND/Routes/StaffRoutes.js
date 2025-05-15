const express = require("express");
const router = express.Router();
//Insert Model
const Staff = require("../Model/StaffModel");
//Insert Doctor Controller
const StaffController = require("../Controller/StaffController");

router.get("/",StaffController.getAllStaff);
router.post("/",StaffController.addStaffs);
router.get("/:id",StaffController.getByIdStaff);
router.put("/:id",StaffController.updateStaffs);
router.delete("/:id",StaffController.deleteStaff);

//export
module.exports = router;