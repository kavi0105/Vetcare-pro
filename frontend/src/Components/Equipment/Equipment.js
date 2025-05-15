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
import DownloadButton from "../../Elements/download"; // Replace with a regular button if needed
import emailjs from 'emailjs-com';

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
  
  useEffect(() => {
    equipments.forEach((equipment) => {
      if (equipment.qty === 0 && !equipment.lowStockNotified) {
        sendLowStockEmail(equipment._id);
        equipment.lowStockNotified = true; // In-memory flag to prevent multiple emails
      }
    });
  }, [equipments]);
  
  

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this equipment?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${_id}`);
      setEquipments((prev) => prev.filter((eq) => eq._id !== _id));
      setFilteredEqp((prev) => prev.filter((eq) => eq._id !== _id));
      toastContext.setToast("Equipment deleted successfully!", Toast.SUCCESS);
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toastContext.setToast("Error deleting equipment!", Toast.ERROR);
    }
  };

  const handleUpdate = (_id) => {
    navigate(`/updateequipment/${_id}`);
  };

  const handleSearch = (searchTerm) => {
    const filtered = equipments.filter((equipment) =>
      equipment.eqName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.eqId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      equipment.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
      equipment.issuedDate.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEqp(filtered);
  };

  const downloadReport = () => {
    if (equipments.length === 0) {
      toastContext.setToast("No equipment data available!", Toast.WARNING);
      return;
    }

    const doc = new jsPDF();
    doc.text("Equipment Report", 14, 15);

    const tableColumn = [
      "Equipment Name",
      "Equipment ID",
      "QTY",
      "Issued Date",
      "Supplier",
    ];
    const tableRows = equipments.map((eq) => [
      eq.eqName,
      eq.eqId,
      eq.qty.toString(),
      eq.issuedDate,
      eq.supplier,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 20 },
    });

    doc.save("Equipment_Report.pdf");
  };

  const getStatusBadge = (qty) => {
    let style = {
      display: "inline-block",
      padding: "2px 8px",
      marginLeft: "8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white",
    };
  
    if (qty > 10) {
      style.backgroundColor = "#2ecc71"; // Green
      return <span style={style}>Available</span>;
    } else if (qty >= 1 && qty <= 10) {
      style.backgroundColor = "#f39c12"; // Orange
      return <span style={style}>Low Stock</span>;
    } else if (qty === 0) {
      style.backgroundColor = "#e74c3c"; // Red
      return <span style={style}>Out of Stock</span>;
    }
  };
  
  

  const sendLowStockEmail = (eqId) => {
    const equipment = equipments.find((eq) => eq._id === eqId);
    if (!equipment) return;

    const emailParams = {
      to_name: "Supplier", 
      from_name: "VetCarePro", 
      message: `Dear Supplier,\n\nThe stock for ${equipment.eqName} is out of stock. Please refill the stock.\n\nCurrent Quantity: ${equipment.qty}`,
      supplier_email: "onerlirajapakse2004@gmail.com", 
    };

    emailjs
      .send(
        'service_mhugz03', 
        'template_sytz7a5', 
        emailParams,
        '5ToUZH2gxWrI7uwOP' 
      )
      .then(
        (response) => {
          toastContext.setToast("Out of stock notification sent!", Toast.SUCCESS);
          console.log('Email sent successfully', response);
        },
        (error) => {
          toastContext.setToast("Failed to send low stock notification!", Toast.ERROR);
          console.log('Email sending failed', error);
        }
      );
  };

  return (
    <div className="doctor-details-container">
      <h2>Equipment Details</h2>
      <SearchBar onSearch={handleSearch} />
      <DownloadButton onClick={downloadReport}>Download</DownloadButton>
      <table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Equipment ID</th>
            <th>QTY</th>
            <th>Issued Date</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fillteredEqp.map((equipment) => (
            <tr key={equipment._id}>
              <td>{equipment.eqName}</td>
              <td>{equipment.eqId}</td>
              <td>
                {equipment.qty} {getStatusBadge(equipment.qty, equipment._id)}
              </td>
              <td>{equipment.issuedDate}</td>
              <td>{equipment.supplier}</td>
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
