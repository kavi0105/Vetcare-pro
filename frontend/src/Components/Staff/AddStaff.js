import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../Styles/AddDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function AddStaff() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    staffId: "",
    age: "",
    jobRole: "",
    salary: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    staffId: "",
    age: "",
    jobRole: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the form immediately on change
    validate(name, value);
  };

  const validate = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value) {
          errorMessage = "Name is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          errorMessage = "Name should contain only letters.";
        }
        break;

      case "staffId":
        if (!value) {
          errorMessage = "Staff ID is required.";
        } else if (!/^[A-Za-z0-9]+$/.test(value)) {
          errorMessage = "Staff ID should be alphanumeric.";
        }
        break;

      case "age":
        if (!value) {
          errorMessage = "Age is required.";
        } else if (isNaN(value) || value <= 0) {
          errorMessage = "Age should be a positive number.";
        }
        break;

      case "jobRole":
        if (!value) {
          errorMessage = "Job role is required.";
        }
        break;

      case "salary":
        if (!value) {
          errorMessage = "Salary is required.";
        } else if (isNaN(value) || value <= 0) {
          errorMessage = "Salary should be a positive number.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    return errorMessage; // Return the error message for use in handleSubmit
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let newErrors = {};
    let isValid = true;

    // Validate all fields before submission
    Object.keys(inputs).forEach((key) => {
      const errorMessage = validate(key, inputs[key]); // Validate field and get error message

      if (errorMessage) {
        newErrors[key] = errorMessage;
        isValid = false;
      }
    });

    setErrors(newErrors); // Update state with errors

    if (!isValid) {
      console.log("Form validation failed.", newErrors);
      return; // Stop submission if validation fails
    }

    console.log("Staff Added:", inputs);
    sendRequest().then(() => history("/staffdetails"));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/staffs", {
        name: String(inputs.name),
        staffId: String(inputs.staffId),
        age: Number(inputs.age),
        jobRole: String(inputs.jobRole),
        salary: Number(inputs.salary),
      });

      // Show success toast
      toastContext.setToast("Staff added successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      // Show error toast if the request fails
      toastContext.setToast(
        "Failed to add staff. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Staff</h1>
      <form onSubmit={handleSubmit} className="doctor-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
        />
        {errors.name && <span className="errorStaff">{errors.name}</span>}

        <label>Staff ID:</label>
        <input
          type="text"
          name="staffId"
          value={inputs.staffId}
          onChange={handleChange}
        />
        {errors.staffId && <span className="errorStaff">{errors.staffId}</span>}

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={inputs.age}
          onChange={handleChange}
        />
        {errors.age && <span className="errorStaff">{errors.age}</span>}

        <label>Job Role:</label>
        <input
          type="text"
          name="jobRole"
          value={inputs.jobRole}
          onChange={handleChange}
        />
        {errors.jobRole && <span className="errorStaff">{errors.jobRole}</span>}

        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={inputs.salary}
          onChange={handleChange}
        />
        {errors.salary && <span className="errorStaff">{errors.salary}</span>}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddStaff;
