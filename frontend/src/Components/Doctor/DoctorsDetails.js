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

const URL = "http://localhost:5000/doctors";

function DoctorDetails() {
  const toastContext = useContext(ToastContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctor, setFilteredDoctor] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(URL);
      setDoctors(response.data.doctors);
      setFilteredDoctor(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setFilteredDoctor(doctors.filter((doctor) => doctor._id !== _id));
      toastContext.setToast("Doctor deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toastContext.setToast("Error deleting doctor!", Toast.ERROR);
    }
  };

  const handleUpdate = (doctorId) => {
    navigate(`/doctordetails/${doctorId}`); // Navigate to update page
  };

  const downloadReport = () => {
    if (doctors.length === 0) {
      toastContext.setToast("No doctor data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();

    const csvHeaders = [
      "ID",
      "Name",
      "Specialized Field",
      "Contact Number",
      "Available Slot",
    ];

    const csvRows = doctors.map((doctor) => [
      doctor.doctorId,
      doctor.name,
      doctor.specializedField,
      doctor.assignedPatients,
      doctor.availableSlot,
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

    doc.save("Doctor_Report.pdf");
  };

  const handleSearch = (searchTerm) => {
    const filtered = doctors.filter((appointment) =>
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctor(filtered);
  };

  return (
    <div className="doctor-details-container">
      <h2>Doctor Details</h2>
      <SearchBar onSearch={handleSearch} />
      {/* <DownloadButton onClick={downloadReport}>Download</DownloadButton> */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialized Field</th>
            <th>Contact Number</th>
            <th>Available Slot</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctor.map((doctor) => (
            <tr key={doctor.doctorId}>
              <td>{doctor.doctorId}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specializedField}</td>
              <td>{doctor.assignedPatients}</td>
              <td>{doctor.availableSlot}</td>
              <td>
                <button
                  onClick={() => handleUpdate(doctor._id)}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(doctor._id)}>
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

export default DoctorDetails;
