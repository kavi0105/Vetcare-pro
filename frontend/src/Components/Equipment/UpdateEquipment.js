import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
// import "../../Styles/UpdateEquipment.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function UpdateEquipment() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const id = useParams().id;
  const [inputs, setInputs] = useState({
    eqName: "",
    eqId: "",
    qty: "",
    issuedDate: "",
  });

  useEffect(() => {
    const fetchEquipments = async () => {
      await axios
        .get(`http://localhost:5000/equipments/${id}`)
        .then((res) => {
          setInputs({
            eqName: res.data.equipment.eqName,
            eqId: res.data.equipment.eqId,
            qty: res.data.equipment.qty,
            issuedDate: res.data.equipment.issuedDate,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchEquipments();
  }, [id]);



  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/equipments/${id}`, {
        eqName: String(inputs.eqName),
        eqId: String(inputs.eqId),
        qty: String(inputs.qty),
        issuedDate: String(inputs.issuedDate),
      });

      toastContext.setToast("Equipment updated successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      // Show error toast if the request fails
      toastContext.setToast(
        "Failed to add equipment. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding equipment:", error);
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/equipmentdetails"));
  };

  return (
    <div class="form-container">
      <h1>Update Equipment</h1>
      <form onSubmit={handleSubmit} class="doctor-form">
        <label>Equipment Name:</label>
        <input
          type="text"
          name="eqName"
          value={inputs.eqName}
          onChange={handleChange}
          required
        />

        <label>Equipment ID:</label>
        <input
          type="text"
          name="eqId"
          value={inputs.eqId}
          onChange={handleChange}
          required
        />

        <label>QTY:</label>
        <input
          type="text"
          name="qty"
          value={inputs.qty}
          onChange={handleChange}
          required
        />

        <label>Issued Date:</label>
        <input
          type="text"
          name="issuedDate"
          value={inputs.issuedDate}
          onChange={handleChange}
          required
        />

        <button type="submit" class="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateEquipment;
