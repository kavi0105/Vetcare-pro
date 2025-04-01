const Staff = require("../Model/StaffModel");

//data display
const getAllStaff = async (req, res, next) => {
  let Staffs;
  //get all doctors
  try {
    staffs = await Staff.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!staffs) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  // display all staffs
  return res.status(200).json({ staffs });
};

//data Insert
const addStaffs = async (req, res, next) => {
  const { name, staffId, age, jobRole, salary } = req.body;

  let staffs;

  try {
    staffs = new Staff({
      name,
      staffId,
      age,
      jobRole,
      salary,
    });
    await staffs.save();
  } catch (err) {
    console.log(err);
  }

  //not insert staffs
  if (!staffs) {
    return res.status(404).json({ message: "Unable to add staffs" });
  }
  return res.status(200).json({ staffs });
};

//get by Id
const getByIdStaff = async (req, res, next) => {
  const id = req.params.id;
  let staff;
  try {
    staff = await Staff.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not available staffs
  if (!staff) {
    return res.status(404).json({ message: "staff not found" });
  }
  return res.status(200).json({ staff });
};

//Update Doctor Details
const updateStaffs = async (req, res, next) => {
  const id = req.params.id;
  const { name, staffId, age, jobRole, salary } =
    req.body;

  let staffs;

  try {
    staffs = await Staff.findByIdAndUpdate(id, {
      name: name,
      staffId: staffId,
      age: age,
      jobRole: jobRole,
      salary: salary,
    });
    staffs = await staffs.save();
  } catch (err) {
    console.log(err);
  }
  //not update staffs
  if (!staffs) {
    return res.status(404).json({ message: "Unable to Update Doctor Details" });
  }
  return res.status(200).json({ staffs });
};

//Delete Staff
const deleteStaff = async (req, res, next) => {
  const id = req.params.id;
  let staff;
  try {
    staff = await Staff.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  //not delete staffs
  if (!staff) {
    return res.status(404).json({ message: "Unable to Delete staff Details" });
  }
  return res.status(200).json({ staff });
};

exports.getAllStaff = getAllStaff;
exports.addStaffs = addStaffs;
exports.getByIdStaff = getByIdStaff;
exports.updateStaffs = updateStaffs;
exports.deleteStaff = deleteStaff;
