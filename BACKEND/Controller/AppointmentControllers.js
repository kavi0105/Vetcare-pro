const Appointment = require("../Model/AppointmentModel");
const nodemailer = require("nodemailer");

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
    email, // 📧 collect email too
  } = req.body;

  let appointment;

  try {
    // 1. Save appointment
    appointment = new Appointment({
      name,
      contactNumber,
      petName,
      petType,
      petAge,
      appointmentTime,
      appointmentDate,
      doctorName,
      email, // Save email if needed
    });
    await appointment.save();

    let transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: "onelirajapakse2004@gmail.com", 
        pass: "yrmizzbkzlsxbrsg", 
      },
    });

    let mailOptions = {
      from: '"Hospital Admin" <onelirajapakse2004@gmail.com>',
      to: email,
      subject: "Appointment Confirmation",
      text: `Hello ${name}! Your appointment for ${petName} (${petType}) with Dr.${doctorName} is confirmed on ${appointmentDate} at ${appointmentTime}.`,
      html: `<h2>Appointment Confirmed</h2>
         <p><strong>Owner:</strong> ${name}</p>
         <p><strong>Pet:</strong> ${petName} (${petType}, Age: ${petAge})</p>
         <p><strong>Doctor:</strong> ${doctorName}</p>
         <p><strong>Date & Time:</strong> ${appointmentDate} at ${appointmentTime}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("Error adding doctor or sending notifications:", err);
  }

  if (!doctors) {
    return res.status(404).json({ message: "Unable to add doctors" });
  }

  return res.status(200).json({ doctors });
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
    email
  } = req.body;

  let appointments;

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
      email
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
