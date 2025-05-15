import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/DoctorDetails.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import SearchBar from "../SearchBar/SearchBar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadButton from "../../Elements/download";

const URL = "http://localhost:5000/staffs";

function StaffDetails() {
  const toastContext = useContext(ToastContext);
  const [staffs, setStaffs] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [otDetails, setOtDetails] = useState({}); // Track OT details for each staff

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
      setFilteredStaff((prevStaff) =>
        prevStaff.filter((staff) => staff._id !== _id)
      );
      toastContext.setToast(
        "Staff member deleted successfully!",
        Toast.SUCCESS
      );
    } catch (error) {
      console.error("Error deleting staff:", error);
      toastContext.setToast("Error deleting staff!", Toast.ERROR);
    }
  };

  const handleUpdate = (_id) => {
    navigate(`/updatestaff/${_id}`);
  };

  const handleSearch = (searchTerm) => {
    const filtered = staffs.filter((staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const downloadReport = () => {
    if (staffs.length === 0) {
      toastContext.setToast("No staff data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Staff ID",
      "Email",
      "Age",
      "Job Role",
      "Base Salary",
      "OT Payment",
      "Total Payment",
    ];

    const tableRows = staffs.map((staff) => {
      const otPayment = (staff.otHours || 0) * (staff.otRate || 0);
      const totalPayment = parseFloat(staff.salary) + otPayment;

      return [
        staff.name,
        staff.staffId,
        staff.email,
        staff.age.toString(),
        staff.jobRole,
        parseFloat(staff.salary).toLocaleString(),
        otPayment.toLocaleString(),
        totalPayment.toLocaleString(),
      ];
    });

    doc.text("Staff Report", 14, 15);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 20 },
    });

    doc.save("Staff_Report.pdf");
  };

  const toggleExpand = (staffId) => {
    setExpandedStaffId((prevId) => (prevId === staffId ? null : staffId));
  };

  const handleOtChange = (staffId, field, value) => {
    const numericValue = parseFloat(value) || 0; // Convert value to a number
    setOtDetails((prevDetails) => ({
      ...prevDetails,
      [staffId]: {
        ...prevDetails[staffId],
        [field]: numericValue,
      },
    }));
  };

  const saveOtDetails = (staffId) => {
    // Show a success message
    toastContext.setToast("OT details saved successfully!", Toast.SUCCESS);

    // Collapse the OT section after saving
    setExpandedStaffId(null);
  };

  return (
    <div className="doctor-details-container">
      <h2>Staff Details</h2>
      <SearchBar onSearch={handleSearch} />
      <DownloadButton onClick={downloadReport}>Download</DownloadButton>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Email</th>
            <th>Age</th>
            <th>Job Role</th>
            <th>Salary + OT</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => {
            // Calculate OT Payment & Total Payment
            const otPayment =
              (otDetails[staff._id]?.otHours || staff.otHours || 0) *
              (otDetails[staff._id]?.otRate || staff.otRate || 0);
            const totalPayment = parseFloat(staff.salary) + otPayment;

            return (
              <React.Fragment key={staff._id}>
                <tr>
                  <td>{staff.name}</td>
                  <td
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => toggleExpand(staff._id)}
                  >
                    {staff.staffId}
                  </td>
                  <td>{staff.email}</td>
                  <td>{staff.age}</td>
                  <td>{staff.jobRole}</td>
                  <td>
                    {parseFloat(staff.salary).toLocaleString()} +
                    {otPayment.toLocaleString()} =
                    {totalPayment.toLocaleString()}
                  </td>
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

                {expandedStaffId === staff._id && (
                  <tr className="ot-row">
                    <td colSpan="6">
                      <div
                        style={{
                          padding: "20px",
                          backgroundColor: "#f0f7f6",
                          border: "1px solid #d1e7e5",
                          borderRadius: "8px",
                          marginTop: "10px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                            color: "#16a085",
                          }}
                        >
                          OT Calculation
                        </h3>

                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <label
                              style={{
                                fontWeight: "600",
                                marginBottom: "5px",
                                color: "#555",
                              }}
                            >
                              OT Hours:
                            </label>
                            <input
                              type="number"
                              value={
                                otDetails[staff._id]?.otHours || staff.otHours
                              }
                              onChange={(e) =>
                                handleOtChange(
                                  staff._id,
                                  "otHours",
                                  e.target.value
                                )
                              }
                              style={{
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <label
                              style={{
                                fontWeight: "600",
                                marginBottom: "5px",
                                color: "#555",
                              }}
                            >
                              OT Rate (Rs.):
                            </label>
                            <input
                              type="number"
                              value={
                                otDetails[staff._id]?.otRate || staff.otRate
                              }
                              onChange={(e) =>
                                handleOtChange(
                                  staff._id,
                                  "otRate",
                                  e.target.value
                                )
                              }
                              style={{
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>

                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                            marginBottom: "15px",
                          }}
                        >
                          Total OT Payment: Rs. {otPayment.toLocaleString()}
                        </p>

                        <button
                          onClick={() => saveOtDetails(staff._id)}
                          style={{
                            backgroundColor: "#16a085",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#138d75")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#16a085")
                          }
                        >
                          Save OT Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDetails;
