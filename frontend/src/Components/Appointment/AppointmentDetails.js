import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/DoctorDetails.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DownloadButton from "../../Elements/download";
import SearchBar from "../SearchBar/SearchBar";

const URL = "http://localhost:5000/appointments";

function AppointmentDetails() {
  const toastContext = useContext(ToastContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(URL);
      setAppointments(response.data.appointments);
      setFilteredAppointments(response.data.appointments);
      console.log(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${URL}/${_id}`);
  
      // Use functional update to ensure the latest state
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== _id)
      );
  
      toastContext.setToast("Appointment deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toastContext.setToast("Error deleting appointment!", Toast.ERROR);
    }
  };
  

  const handleUpdate = (_id) => {
    navigate(`/appointmentdetails/${_id}`); // Navigate to update page
  };

  const downloadReport = () => {
    if (appointments.length === 0) {
      toastContext.setToast("No appointment data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();

    const csvHeaders = [
      "Name",
      "Contact Number",
      "Pet Name",
      "Pet Type",
      "Pet Age",
      "Appoinment Time",
      "Appoinment Date",
      "Doctor Name",
    ];

    const csvRows = appointments.map((appointment) => [
      appointment.name,
      appointment.contactNumber,
      appointment.petName,
      appointment.petType,
      appointment.petAge,
      appointment.appointmentTime,
      appointment.appointmentDate,
      appointment.doctorName,
    ]);

    // Draw headers
    let startY = 20;
    doc.text(csvHeaders.join(" | "), 20, startY);

    // Draw rows
    startY += 20;
    csvRows.forEach((row) => {
      doc.text(row.join(" | "), 20, startY);
      startY += 20;
    });

    doc.save("Appointment_Report.pdf");
  };

  const handleSearch = (searchTerm) => {
    const filtered = appointments.filter((appointment) =>
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  return (
    <div className="doctor-details-container">
      <h2>Appoinment Details</h2>
      <SearchBar onSearch={handleSearch} />
      {/* <DownloadButton onClick={downloadReport}>Download</DownloadButton> */}
      <table>
        <thead>
          <tr>
            <th>Pet Owner</th>
            <th>Contact Number</th>
            <th>Pet Name</th>
            <th>Pet Type</th>
            <th>Pet Age</th>
            <th>Appoinment Time</th>
            <th>Appoinment Date</th>
            <th>Doctor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments?.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.name}</td>
              <td>{appointment.contactNumber}</td>
              <td>{appointment.petName}</td>
              <td>{appointment.petType}</td>
              <td>{appointment.petAge}</td>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.doctorName}</td>
              <td>
                <button
                  onClick={() => handleUpdate(appointment._id)}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(appointment._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentDetails;
