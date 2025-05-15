import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/DoctorDetails.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadButton from "../../Elements/download";
import SearchBar from "../SearchBar/SearchBar";

const URL = "http://localhost:5000/doctors";

function DoctorDetails() {
  const toastContext = useContext(ToastContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctor, setFilteredDoctor] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      setDoctors(response.data.doctors);
      setFilteredDoctor(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setFilteredDoctor(doctors.filter((doctor) => doctor._id !== _id));
      const updatedDoctors = doctors.filter((doctor) => doctor._id !== _id);
      setDoctors(updatedDoctors);
      setFilteredDoctor(updatedDoctors);
      toastContext.setToast("Doctor deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toastContext.setToast("Error deleting doctor!", Toast.ERROR);
    }
  };

  const handleUpdate = (doctorId) => {
    navigate(`/doctordetails/${doctorId}`);
  };

  const downloadReport = () => {
    if (doctors.length === 0) {
      toastContext.setToast("No doctor data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();

    const tableColumn = [
      "ID",
      "Name",
      "Specialized Field",
      "Assigned Patients",
      "Available Slot",
      "Email",
    ];

    const tableRows = doctors.map((doctor) => [
      doctor.doctorId,
      doctor.name,
      doctor.specializedField,
      doctor.assignedPatients,
      doctor.availableSlot,
      doctor.email,
    ]);

    doc.text("Doctor Report", 14, 15);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 20 },
    });

    doc.save("Doctor_Report.pdf");
  };

  const handleSearch = (searchTerm) => {
    const filtered = doctors.filter(
      (appointment) =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        appointment.specializedField.toLowerCase().includes(searchTerm.toLowerCase()) || 
        appointment.assignedPatients.toLowerCase().includes(searchTerm.toLowerCase()) || 
        appointment.availableSlot.toLowerCase().includes(searchTerm.toLowerCase()) 
  
    );
    setFilteredDoctor(filtered);
  };

  const isDoctorAvailable = (availableSlot, currentTime) => {
    if (!availableSlot) return false;

    const [startTimeStr, endTimeStr] = availableSlot.split("-");

    const parseTime = (timeStr) => {
      const [hourStr, minuteStr] = timeStr.split(".");
      const hours = parseInt(hourStr, 10);
      const minutes = minuteStr ? parseInt(minuteStr.padEnd(2, "0"), 10) : 0;
      return { hours, minutes };
    };

    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);

    const start = new Date(currentTime);
    start.setHours(startTime.hours, startTime.minutes, 0, 0);

    const end = new Date(currentTime);
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    return currentTime >= start && currentTime <= end;
  };

  return (
    <div className="doctor-details-container">
      {loading ? (
        <div className="loading-spinner">Loading Doctors...</div>
      ) : (
        <>
          <h2>Doctor Details</h2>
          <SearchBar onSearch={handleSearch} />

          <DownloadButton onClick={downloadReport}>Download</DownloadButton>
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: "5px",
              padding: "15px",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "20px 0",
            }}
          >
            <strong>Notice:</strong> The doctors at <strong>VetCarePro</strong>{" "}
            are available every day of the week. The available slots for
            appointments will vary based on the doctor's individual
            availability. While the doctors themselves are present every day,
            the specific time slots they are available will change accordingly.
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialized Field</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Available Slot (24 hrs)</th>
                <th>Status</th>
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
                  <td>{doctor.email}</td>
                  <td>{doctor.availableSlot}</td>
                  <td>
                    {isDoctorAvailable(doctor.availableSlot, currentTime) ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Available
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Not Available
                      </span>
                    )}
                  </td>

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
        </>
      )}
    </div>
  );
}

export default DoctorDetails;
