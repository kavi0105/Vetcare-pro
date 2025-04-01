import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/DoctorDetails.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import SearchBar from "../SearchBar/SearchBar";

const URL = "http://localhost:5000/equipments";

function DoctorDetails() {
  const toastContext = useContext(ToastContext);
  const [equipments, setEquipments] = useState([]);
  const [fillteredEqp, setFilteredEqp] = useState([]);
  const navigate = useNavigate();

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(URL);
      setEquipments(response.data.equipments);
      setFilteredEqp(response.data.equipments);
    } catch (error) {
      console.error("Error fetching equipments:", error);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this equipment?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setEquipments(equipments.filter((equipment) => equipment._id !== _id));
      toastContext.setToast("Equipment deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toastContext.setToast("Error deleting equipment!", Toast.ERROR);
    }
  };

  const handleUpdate = (_id) => {
    navigate(`/updateequipment/${_id}`);
  };

  const handleSearch = (searchTerm) => {
    const filtered = equipments.filter((equipment) =>
      equipment.eqName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEqp(filtered);
  };

  return (
    <div className="doctor-details-container">
      <h2>Equipment Details</h2>
      <SearchBar onSearch={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Equipment ID</th>
            <th>QTY</th>
            <th>Issued Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fillteredEqp.map((equipment) => (
            <tr key={equipment._id}>
              <td>{equipment.eqName}</td>
              <td>{equipment.eqId}</td>
              <td>{equipment.qty}</td>
              <td>{equipment.issuedDate}</td>
              <td>
                <button
                  onClick={() => handleUpdate(equipment._id)}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(equipment._id)}>
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
