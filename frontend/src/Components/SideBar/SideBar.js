import React, { useState } from "react";
import "../../Styles/SideBar.css";
import Logo from "../../images/logo.png";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleToggle = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img
          src={Logo}
          style={{
            width: "150px",
            height: "150px",
            alignContent: "center",
            marginLeft: "40px",
            marginTop: "-20px",
            marginBottom: "-25px",
          }}
        />
      </div>
      <div className="menu-item">
        <a href="/">Home</a>
      </div>

      <div
        className={`menu-item ${activeMenu === "appointment" ? "active" : ""}`}
      >
        <a
          className="dropdown-toggle"
          onClick={() => handleToggle("appointment")}
        >
          Appointment
        </a>
        <div className="dropdown">
          <a href="/appointmentdetails">View Appointment</a>
          <a href="/addappointment">Add Appointment</a>
        </div>
      </div>

      <div className={`menu-item ${activeMenu === "doctor" ? "active" : ""}`}>
        <a className="dropdown-toggle" onClick={() => handleToggle("doctor")}>
          Doctor
        </a>
        <div className="dropdown">
          <a href="/doctordetails">View Doctor Details</a>
          <a href="/adddoctor">Add Doctor</a>
        </div>
      </div>

      <div className={`menu-item ${activeMenu === "staff" ? "active" : ""}`}>
        <a className="dropdown-toggle" onClick={() => handleToggle("staff")}>
          Staff
        </a>
        <div className="dropdown">
          <a href="/staffdetails">View Staff Details</a>
          <a href="/addstaff">Add Staff Members</a>
        </div>
      </div>

      <div
        className={`menu-item ${activeMenu === "equipment" ? "active" : ""}`}
      >
        <a
          className="dropdown-toggle"
          onClick={() => handleToggle("equipment")}
        >
          Equipment
        </a>
        <div className="dropdown">
          <a href="/equipmentdetails">View Equipment</a>
          <a href="/addequipment">Add Equipment</a>
        </div>
      </div>

      <div className={`menu-item ${activeMenu === "pet" ? "active" : ""}`}>
        <a className="dropdown-toggle" onClick={() => handleToggle("pet")}>
          Pet Service
        </a>
        <div className="dropdown">
          <a href="/petdetails">View Pet Details</a>
          <a href="/addpet">Add Pet Service</a>
        </div>
      </div>

      <div className="menu-item">
        <a href="#">Contact Us</a>
      </div>

      <div
        className="menu-item"
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
        }}
      >
        <a href="#" style={{ textDecoration: "none" }}>
          <div
            className="admin-text"
            style={{ display: "flex", alignItems: "center", color: "#333" }}
          >
            <span className="material-icons" style={{ marginRight: "8px" }}>
              account_circle
            </span>
            Admin
          </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
