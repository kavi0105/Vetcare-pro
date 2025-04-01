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

const URL = "http://localhost:5000/pets";

function PetDetails() {
  const toastContext = useContext(ToastContext);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const navigate = useNavigate();

  const fetchPets = async () => {
    try {
      const response = await axios.get(URL);
      setPets(response.data.pets);
      setFilteredPets(response.data.pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setFilteredPets(pets.filter((pet) => pet._id !== _id));
      toastContext.setToast("Pet deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting pet:", error);
      toastContext.setToast("Error deleting pet!", Toast.ERROR);
    }
  };

  const handleUpdate = (_id) => {
    navigate(`/petdetails/${_id}`); // Navigate to update page
  };

  const downloadReport = () => {
    if (pets.length === 0) {
      toastContext.setToast("No pet data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();

    const csvHeaders = [
      "ID",
      "Name",
      "Specialized Field",
      "Assigned Patients",
      "Available Slot",
    ];

    const csvRows = pets.map((pet) => [
      pet.doctorId,
      pet.name,
      pet.specializedField,
      pet.assignedPatients,
      pet.availableSlot,
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
    const filtered = pets.filter((pet) =>
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  return (
    <div className="pet-details-container">
      <h2>Pet Details</h2>
      <SearchBar onSearch={handleSearch} />
      {/* <DownloadButton onClick={downloadReport}>Download</DownloadButton> */}
      <table>
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Pet Age</th>
            <th>Pet Typed</th>
            <th>Pet Breed</th>
            <th>Vaccine Dates</th>
            <th> Owner Name</th>
            <th> Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.map((pet) => (
            <tr key={pet.petName}>
              <td>{pet.petName}</td>
              <td>{pet.petAge}</td>
              <td>{pet.petType}</td>
              <td>{pet.petBreed}</td>
              <td>{pet.vaccineDates}</td>
              <td>{pet.petOwnerName}</td>
              <td>{pet.ownerContactNumber}</td>
              <td>
                <button
                  onClick={() => handleUpdate(pet._id)}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(pet._id)}>
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

export default PetDetails;
