const Appointment = require("../Model/AppointmentModel");

// Fetch all users
const getAllAppointment = async (req, res, next) => {
  let Appoitments;

  try {
    appointments = await Appointment.find();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  // If no appointments found
  if (!appointments) {
    return res.status(404).json({ message: "No appointments found" });
  }

  return res.status(200).json({ appointments });
};

// Insert a new user
const addAppointment = async (req, res, next) => {
  const {
    name,
    contactNumber,
    petName,
    petType,
    petAge,
    appointmentTime,
    appointmentDate,
    doctorName,
  } = req.body;

  let appointments;

  try {
    appointments = new Appointment({
      name,
      contactNumber,
      petName,
      petType,
      petAge,
      appointmentTime,
      appointmentDate,
      doctorName,
    }); // Corrected model usage
    await appointments.save();
  } catch (err) {
    console.error(err);
  }

  if (!appointments) {
    return res.status(404).json({ message: "Unable to add appointments" });
  }
  return res.status(200).json({ appointments });
};

// Get user by ID
const getByIdAppointment = async (req, res, next) => {
  const id = req.params.id;

  let appointment;

  try {
    appointment = await Appointment.findById(id); // Fixed the reference to User
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error retrieving appointment" });
  }

  // If appointment not found
  if (!appointment) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ appointment }); // Return user instead of users
};

//update User Details
const updateAppointment = async (req, res, next) => {
  const id = req.params.id;
  const {
    name,
    contactNumber,
    petName,
    petType,
    petAge,
    appointmentTime,
    appointmentDate,
    doctorName,
  } = req.body;

  let appointments

  try {
    appointments = await Appointment.findByIdAndUpdate(id, {
      name,
      contactNumber,
      petName,
      petType,
      petAge,
      appointmentTime,
      appointmentDate,
      doctorName,
    });
    appointments = await appointments.save();
  } catch (err) {
    console.log(err);
  }
  if (!appointments) {
    return res.status(404).json({ message: "Unable to Update User Details" });
  }

  return res.status(200).json({ appointments }); // Return user instead of users
};

//Delete User Details
const deleteAppointment = async (req, res, next) => {
  const id = req.params.id;

  let appointment;

  try {
    appointment = await Appointment.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!appointment) {
    return res.status(404).json({ message: "Unable to Delete User Details" });
  }

  return res.status(200).json({ appointment }); // Return user instead of users
};

exports.getAllAppointment = getAllAppointment;
exports.addAppointment = addAppointment;
exports.getByIdAppointment = getByIdAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
