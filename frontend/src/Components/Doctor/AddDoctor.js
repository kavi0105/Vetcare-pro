import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../Styles/AddDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function AddDoctor() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();

  const [inputs, setInputs] = useState({
    doctorId: "",
    name: "",
    specializedField: "",
    assignedPatients: "",
    availableSlot: "",
  });

  const [errors, setErrors] = useState({});

  // Validation rules for each input field
  const validationRules = {
    doctorId: [
      { test: (value) => value.trim(), message: "Doctor ID is required." },
      {
        test: (value) => /^[a-zA-Z0-9]+$/.test(value),
        message: "Doctor ID should be alphanumeric.",
      },
    ],
    name: [
      { test: (value) => value.trim(), message: "Name is required." },
      {
        test: (value) => /^[a-zA-Z\s]+$/.test(value),
        message: "Name should contain only letters and spaces.",
      },
    ],
    specializedField: [
      {
        test: (value) => value.trim(),
        message: "Specialized field is required.",
      },
    ],
    assignedPatients: [
      { test: (value) => value.trim(), message: "Contact number is required." },
      {
        test: (value) => /^[0-9]{10}$/.test(value),
        message: "Contact number must be exactly 10 digits.",
      },
      {
        test: (value) => value.length === 10 || !value.startsWith("0"),
        message:
          "Contact number must be 10 digits and cannot start with a zero.",
      },
    ],

    availableSlot: [
      { test: (value) => value.trim(), message: "Available slot is required." },
    ],
  };

  // General validation function
  const validate = (name, value) => {
    const rules = validationRules[name];
    const error = rules.reduce((acc, { test, message }) => {
      return !acc && !test(value) ? message : acc;
    }, "");
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validate(name, value);
  };

  const validateForm = () => {
    let formErrors = {};
    Object.keys(inputs).forEach((key) => {
      const value = inputs[key];
      const rules = validationRules[key];
      const error = rules.reduce((acc, { test, message }) => {
        return !acc && !test(value) ? message : acc;
      }, "");
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toastContext.setToast(
        "Please fix the errors before submitting.",
        Toast.ERROR
      );
      return;
    }

    console.log("Doctor Added:", inputs);
    sendRequest().then(() => history("/doctordetails"));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/doctors", {
        doctorId: String(inputs.doctorId),
        name: String(inputs.name),
        specializedField: String(inputs.specializedField),
        assignedPatients: String(inputs.assignedPatients),
        availableSlot: String(inputs.availableSlot),
      });

      toastContext.setToast("Doctor added successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      toastContext.setToast(
        "Failed to add doctor. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding doctor:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Doctor</h1>
      <form onSubmit={handleSubmit} className="doctor-form">
        <label>Doctor ID:</label>
        <input
          type="text"
          name="doctorId"
          value={inputs.doctorId}
          onChange={handleChange}
        />
        {errors.doctorId && <p className="error">{errors.doctorId}</p>}

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Specialized Field:</label>
        <input
          type="text"
          name="specializedField"
          value={inputs.specializedField}
          onChange={handleChange}
        />
        {errors.specializedField && (
          <p className="error">{errors.specializedField}</p>
        )}

        <label>Contact Number:</label>
        <input
          type="number"
          name="assignedPatients"
          value={inputs.assignedPatients}
          onChange={handleChange}
        />
        {errors.assignedPatients && (
          <p className="error">{errors.assignedPatients}</p>
        )}

        <label>Available Slot:</label>
        <input
          type="text"
          name="availableSlot"
          value={inputs.availableSlot}
          onChange={handleChange}
        />
        {errors.availableSlot && (
          <p className="error">{errors.availableSlot}</p>
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddDoctor;
