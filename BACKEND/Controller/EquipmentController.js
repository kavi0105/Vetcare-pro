const Equipment = require("../Model/EquipmentModel");

//display
const getAllequipment = async (req, res, next) => {
  let Equipments;

  try {
    equipments = await Equipment.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!equipments) {
    return res.status(404).json({ message: "user not found" });
  }
  /// display all equipments
  return res.status(200).json({ equipments });
};

// data insert
const addEquipment = async (req, res, next) => {
  const { eqName, eqId, qty, issuedDate } = req.body;

  let equipments;

  try {
    equipments = new Equipment({ eqName, eqId, qty, issuedDate });
    await equipments.save();
  } catch (err) {
    console.log(err);
  }
  // not insert users
  if (!equipments) {
    return res.status(404).json({ message: "unbale to add equipments" });
  }
  return res.status(200).json({ equipments });
};

//Get by Id
const getByIdEquipment = async (req, res, next) => {
  const id = req.params.id;

  let equipment;

  try {
    equipment = await Equipment.findById(id);
  } catch (err) {
    console.log(err);
  }
  // not available users
  if (!equipment) {
    return res.status(404).json({ message: "equipment not find" });
  }
  return res.status(200).json({ equipment });
};

// update user details
const updateEquipment = async (req, res, next) => {
  const id = req.params.id;
  const { eqName, eqId, qty, issuedDate } = req.body;

  let equipments;

  try {
    equipments = await Equipment.findByIdAndUpdate(id, {
      eqName: eqName,
      eqId: eqId,
      qty: qty,
      issuedDate: issuedDate,
    });
    equipments = await equipments.save();
  } catch (err) {
    console.log(err);
  }
  if (!equipments) {
    return res.status(404).json({ message: "unbale to update" });
  }
  return res.status(200).json({ equipments });
};

//delete user
const deleteEquipment = async (req, res, next) => {
  const id = req.params.id;

  let equipment;

  try {
    equipment = await Equipment.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!equipment) {
    return res.status(404).json({ message: "unbale to delete" });
  }
  return res.status(200).json({ equipment });
};

exports.getAllequipment = getAllequipment;
exports.addEquipment = addEquipment;
exports.getByIdEquipment = getByIdEquipment;
exports.updateEquipment = updateEquipment;
exports.deleteEquipment = deleteEquipment;