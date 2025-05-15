const express = require("express");
const router = express.Router();
//insert model
const user = require("../Model/EquipmentModel");
// isnert user contoller
const EquipmentController= require("../Controller/EquipmentController");

router.get("/",EquipmentController.getAllequipment);
router.post("/",EquipmentController.addEquipment);
router.get("/:id",EquipmentController.getByIdEquipment);
router.put("/:id",EquipmentController.updateEquipment);
router.delete("/:id",EquipmentController.deleteEquipment);

//export
module.exports = router;