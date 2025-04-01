import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";
import "../../Styles/AddDoctor.css";

function AddEquipment() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    eqName: "",
    eqId: "",
    qty: "",
    issuedDate: "",
  });
  const [errors, setErrors] = useState({
    eqName: "",
    eqId: "",
    qty: "",
    issuedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the input field individually onChange
    const formErrors = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name],
    }));
  };

  const validateField = (name, value) => {
    let formErrors = { eqName: "", eqId: "", qty: "", issuedDate: "" };

    // Validate based on the field name
    switch (name) {
      case "eqName":
        if (!value.trim()) {
          formErrors.eqName = "Equipment Name is required.";
        } else {
          formErrors.eqName = "";
        }
        break;

      case "eqId":
        if (!value.trim()) {
          formErrors.eqId = "Equipment ID is required.";
        } else {
          formErrors.eqId = "";
        }
        break;

      case "qty":
        if (!value || isNaN(value) || Number(value) <= 0) {
          formErrors.qty = "Quantity must be a positive number.";
        } else {
          formErrors.qty = "";
        }
        break;

      case "issuedDate":
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!value.match(dateRegex)) {
          formErrors.issuedDate = "Issued Date must be in YYYY-MM-DD format.";
        } else {
          formErrors.issuedDate = "";
        }
        break;

      default:
        break;
    }

    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let newErrors = {};
    let isValid = true;

    // Validate all fields before submission
    Object.keys(inputs).forEach((key) => {
      const fieldErrors = validateField(key, inputs[key]);

      // Merge field-specific errors into newErrors
      if (fieldErrors[key]) {
        newErrors[key] = fieldErrors[key];
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    setErrors(newErrors);

    if (isValid) {
      console.log("Equipment Added:", inputs);
      sendRequest().then(() => history("/equipmentdetails"));
    } else {
      console.log("Form validation failed.", newErrors);
    }
  };

  const sendRequest = async () => {
    try {
      const res = await axios
        .post("http://localhost:5000/equipments", {
          eqName: String(inputs.eqName),
          eqId: String(inputs.eqId),
          qty: String(inputs.qty),
          issuedDate: String(inputs.issuedDate),
        })
        .then((res) => res.data);

      // Show success toast
      toastContext.setToast("Equipment added successfully!", Toast.SUCCESS);

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

  return (
    <div className="form-container">
      <h1>Add Equipment</h1>
      <form onSubmit={handleSubmit} className="doctor-form">
        <label>Equipment Name:</label>
        <input
          type="text"
          name="eqName"
          value={inputs.eqName}
          onChange={handleChange}
        />
        {errors.eqName && <p className="error">{errors.eqName}</p>}

        <label>Equipment ID:</label>
        <input
          type="text"
          name="eqId"
          value={inputs.eqId}
          onChange={handleChange}
        />
        {errors.eqId && <p className="error">{errors.eqId}</p>}

        <label>QTY:</label>
        <input
          type="number"
          name="qty"
          value={inputs.qty}
          onChange={handleChange}
        />
        {errors.qty && <p className="error">{errors.qty}</p>}

        <label>Issued Date:</label>
        <input
          type="text"
          name="issuedDate"
          value={inputs.issuedDate}
          onChange={handleChange}
        />
        {errors.issuedDate && <p className="error">{errors.issuedDate}</p>}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddEquipment;
