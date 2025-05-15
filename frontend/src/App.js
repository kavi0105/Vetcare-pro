import React from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./Components/Home/Home";
import AddDoctor from "./Components/Doctor/AddDoctor";
import DoctorDetails from "./Components/Doctor/DoctorsDetails";
import UpdateDoctor from "./Components/Doctor/UpdateDoctor";
import SideBar from "./Components/SideBar/SideBar";
import AddEquipment from "./Components/Equipment/AddEquipment";
import EquipmentDetails from "./Components/Equipment/Equipment";
import UpdateEquipment from "./Components/Equipment/UpdateEquipment";
import AddStaff from "./Components/Staff/AddStaff";
import StaffDetails from "./Components/Staff/StaffDetails";
import UpdateStaff from "./Components/Staff/UpdateStaff";
import AddAppointment from "./Components/Appointment/AddAppointment";
import AppointmentDetails from "./Components/Appointment/AppointmentDetails";
import UpdateAppointment from "./Components/Appointment/UpdateAppointment";
import AddPet from "./Components/Pets/AddPet";
import PetDetails from "./Components/Pets/PetDetails";
import UpdatePet from "./Components/Pets/UpdatePet";
import LoginPage from "./Components/Login/Login";

function App() {
  return (
    <div className="app-background">
      <div className="main-content">
        {/* Sidebar */}
        <div className="side-bar-wrapper">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="content-wrapper">
          <Routes>
            {/* <Route path="/" element={<LoginPage />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/adddoctor" element={<AddDoctor />} />
            <Route path="/doctordetails" element={<DoctorDetails />} />
            <Route path="/doctordetails/:id" element={<UpdateDoctor />} />
            <Route path="/addequipment" element={<AddEquipment />} />
            <Route path="/equipmentdetails" element={<EquipmentDetails />} />
            <Route path="/updateequipment/:id" element={<UpdateEquipment />} />
            <Route path="/addstaff" element={<AddStaff />} />
            <Route path="/staffdetails" element={<StaffDetails />} />
            <Route path="/updatestaff/:id" element={<UpdateStaff />} />
            <Route path="/addappointment" element={<AddAppointment />} />
            <Route
              path="/appointmentdetails"
              element={<AppointmentDetails />}
            />
            <Route
              path="/appointmentdetails/:id"
              element={<UpdateAppointment />}
            />
            <Route path="/addpet" element={<AddPet />} />
            <Route path="/petdetails" element={<PetDetails />} />
            <Route path="/petdetails/:id" element={<UpdatePet />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
