//pass= ioasz4XQurbVChvh

const express = require("express");
const mongoose = require("mongoose");
const doctor = require("./Routes/DoctorRoutes");
const equipment = require("./Routes/EquipmentRoutes");
const staff = require("./Routes/StaffRoutes");
const appointment = require("./Routes/AppointmentRoutes");
const pet = require("./Routes/PetRoutes");

const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());
app.use("/doctors", doctor);
app.use("/equipments", equipment);
app.use("/staffs", staff);
app.use("/appointments", appointment);
app.use("/pets", pet);

mongoose
  .connect("mongodb+srv://admin:ioasz4XQurbVChvh@cluster0.wcr59.mongodb.net/")
  .then(() => console.log("Connect to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
