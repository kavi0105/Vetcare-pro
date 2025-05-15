const Doctor = require("../Model/DoctorModel");
const nodemailer = require('nodemailer');


//data display
const getAllDoctors = async (req, res, next) => {
  let Doctors;
  //get all doctors
  try {
    doctors = await Doctor.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!doctors) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  // display all doctors
  return res.status(200).json({ doctors });
};

//data Insert
const addDoctors = async (req, res, next) => {
  const { doctorId, name, specializedField, assignedPatients, availableSlot, email } = req.body;

  let doctors;

  try {
    doctors = new Doctor({
      doctorId,
      name,
      specializedField,
      assignedPatients,
      availableSlot,
      email,
    });
    await doctors.save();

    // ✅ Send Email (new part)
    let transporter = nodemailer.createTransport({
      service: 'gmail', // 👉 or use 'outlook', 'yahoo', etc.
      auth: {
        user: 'onelirajapakse2004@gmail.com', // ✉️ your email address
        pass: 'yrmizzbkzlsxbrsg' // 🔑 use an App Password if Gmail
      }
    });

    let mailOptions = {
      from: '"Hospital Admin" <onelirajapakse2004@gmail.com>', // sender
      to: email, // 👉 where to send email (doctor's email)
      subject: 'You were added as a Doctor',
      text: `Doctor ${name} has been successfully added.\nSpecialized Field: ${specializedField}\nAvailable Slot: ${availableSlot}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">You were added as a Doctor</h2>
          <p style="font-size: 18px; text-align: center; color: #555;">We are excited to inform you that you have been added to the VetCarePro team.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;"><strong style="color: #333;">Name:</strong> ${name}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong style="color: #333;">Specialized Field:</strong> ${specializedField}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong style="color: #333;">Available Slot:</strong> ${availableSlot}</p>
          </div>
    
          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">Thank you for being part of our VetCarePro team!</p>
        </div>
      `
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

 

//get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let doctor;
  try {
    doctor = await Doctor.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not available doctors
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  return res.status(200).json({ doctor });
};

//Update Doctor Details
const updateDoctor = async (req, res, next) => {
  const id = req.params.id;
  const { doctorId, name, specializedField, assignedPatients, availableSlot, email } = req.body;

  let doctors;

  try {
    doctors = await Doctor.findByIdAndUpdate(id, {
      doctorId,
      name,
      specializedField,
      assignedPatients,
      availableSlot,
      email
    }, { new: true }); // 👉 { new: true } to get the updated document directly

    if (!doctors) {
      return res.status(404).json({ message: "Unable to Update Doctor Details" });
    }

    // ✅ Send Update Email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'onelirajapakse2004@gmail.com',
        pass: 'yrmizzbkzlsxbrsg'
      }
    });

    let mailOptions = {
      from: '"Hospital Admin" <onelirajapakse2004@gmail.com>',
      to: email,
      subject: 'Your Doctor Profile has been Updated',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Doctor Profile Updated</h2>
          <p style="font-size: 18px; text-align: center; color: #555;">Your doctor profile has been updated successfully.</p>

          <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 20px;">
            <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
            <p style="font-size: 16px;"><strong>Specialized Field:</strong> ${specializedField}</p>
            <p style="font-size: 16px;"><strong>Available Slot:</strong> ${availableSlot}</p>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">Thank you for being with VetCarePro!</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Update Email sent successfully:", info.messageId);

  } catch (err) {
    console.error("Error updating doctor or sending email:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(200).json({ doctors });
};


//Delete Doctor
//Delete Doctor
const deleteDoctor = async (req, res, next) => {
  const id = req.params.id;
  let doctor;
  try {
    doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Unable to Delete Doctor Details" });
    }

    // ✅ Send Deletion Email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'onelirajapakse2004@gmail.com',
        pass: 'yrmizzbkzlsxbrsg'
      }
    });

    let mailOptions = {
      from: '"Hospital Admin" <onelirajapakse2004@gmail.com>',
      to: doctor.email, // 👈 sending email to deleted doctor's email
      subject: 'Doctor Profile Deleted',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #F44336; text-align: center;">Doctor Profile Deleted</h2>
          <p style="font-size: 18px; text-align: center; color: #555;">We regret to inform you that your doctor profile has been removed from VetCarePro.</p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 20px;">
            <p style="font-size: 16px;"><strong>Name:</strong> ${doctor.name}</p>
            <p style="font-size: 16px;"><strong>Specialized Field:</strong> ${doctor.specializedField}</p>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">If you have any questions, please contact VetCarePro Support.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Deletion Email sent successfully:", info.messageId);

  } catch (err) {
    console.error("Error deleting doctor or sending email:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(200).json({ doctor });
};


exports.getAllDoctors = getAllDoctors;
exports.addDoctors = addDoctors;
exports.getById = getById;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
