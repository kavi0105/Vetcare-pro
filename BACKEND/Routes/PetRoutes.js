const express = require("express");
const router = express.Router();
//Insert Model
const Pet = require("../Model/PetModel");
//Insert Pet Controller
const PetController = require("../Controller/PetController");

router.get("/",PetController.getAllPet);
router.post("/",PetController.addPet);
router.get("/:id",PetController.getByIdPet);
router.put("/:id",PetController.updatePet);
router.delete("/:id",PetController.deletePet);

//export
module.exports = router;