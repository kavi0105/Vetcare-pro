import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/DoctorDetails.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import SearchBar from "../SearchBar/SearchBar";

const URL = "http://localhost:5000/staffs";

function StaffDetails() {
  const toastContext = useContext(ToastContext);
  const [staffs, setStaffs] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      const response = await axios.get(URL);
      setStaffs(response.data.staffs);
      setFilteredStaff(response.data.staffs);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setFilteredStaff(staffs.filter((staff) => staff._id !== _id));
      toastContext.setToast("Doctor deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toastContext.setToast("Error deleting doctor!", Toast.ERROR);
    }
  };

  const handleUpdate = (_id) => {
    navigate(`/updatestaff/${_id}`); // Navigate to update page
  };

  const handleSearch = (searchTerm) => {
    const filtered = staffs.filter((staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  return (
    <div className="doctor-details-container">
      <h2>Staff Details</h2>
      <SearchBar onSearch={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Age</th>
            <th>Job Role</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.name}>
              <td>{staff.name}</td>
              <td>{staff.staffId}</td>
              <td>{staff.age.toString()}</td>
              <td>{staff.jobRole}</td>
              <td>{staff.salary.toString()}</td>
              <td>
                <button
                  onClick={() => handleUpdate(staff._id)}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(staff._id)}>
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

export default StaffDetails;
