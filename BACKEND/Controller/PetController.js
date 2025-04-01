const Pet = require("../Model/PetModel");

//data display
const getAllPet = async (req, res, next) => {
  let Pets;
  //get all pets
  try {
    pets = await Pet.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!pets) {
    return res.status(404).json({ message: "Pet not found" });
  }
  // display all pets
  return res.status(200).json({ pets });
};

//data Insert
const addPet = async (req, res, next) => {
  const {
    petName,
    petAge,
    petType,
    petBreed,
    vaccineDates,
    petOwnerName,
    ownerContactNumber,
  } = req.body;

  let pets;

  try {
    pets = new Pet({
      petName,
      petAge,
      petType,
      petBreed,
      vaccineDates,
      petOwnerName,
      ownerContactNumber,
    });
    await pets.save();
  } catch (err) {
    console.log(err);
  }

  //not insert pets
  if (!pets) {
    return res.status(404).json({ message: "Unable to add pets" });
  }
  return res.status(200).json({ pets });
};

//get by Id
const getByIdPet = async (req, res, next) => {
  const id = req.params.id;
  let pet;
  try {
    pet = await Pet.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not available doctors
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }
  return res.status(200).json({ pet });
};

//Update Pet Details
const updatePet = async (req, res, next) => {
  const id = req.params.id;
  const {
    petName,
    petAge,
    petType,
    petBreed,
    vaccineDates,
    petOwnerName,
    ownerContactNumber,
  } = req.body;

  let pets;

  try {
    pets = await Pet.findByIdAndUpdate(id, {
      petName: petName,
      petAge: petAge,
      petType: petType,
      petBreed: petBreed,
      vaccineDates: vaccineDates,
      petOwnerName: petOwnerName,
      ownerContactNumber: ownerContactNumber,
    });
    pets = await pets.save();
  } catch (err) {
    console.log(err);
  }
  //not update pets
  if (!pets) {
    return res.status(404).json({ message: "Unable to Update Pet Details" });
  }
  return res.status(200).json({ pets });
};

//Delete Pet
const deletePet = async (req, res, next) => {
  const id = req.params.id;
  let pet;
  try {
    pet = await Pet.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  //not delete doctors
  if (!pet) {
    return res.status(404).json({ message: "Unable to Delete Pet Details" });
  }
  return res.status(200).json({ pet });
};

exports.getAllPet = getAllPet;
exports.addPet = addPet;
exports.getByIdPet = getByIdPet;
exports.updatePet = updatePet;
exports.deletePet = deletePet;
