import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../Styles/AddDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function AddPet() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    petName: "",
    petAge: "",
    petType: "",
    petBreed: "",
    vaccineDates: "",
    petOwnerName: "",
    ownerContactNumber: "",
  });
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => {
      const updatedInputs = {
        ...prevState,
        [name]: value,
      };

      // Validate the field that was changed
      validateField(name, value, updatedInputs);
      return updatedInputs;
    });
  };

  const validateField = (name, value, updatedInputs) => {
    const newErrors = { ...errors };

    switch (name) {
      case "petName":
        if (!value.trim()) {
          newErrors.petName = "Pet Name is required.";
        } else {
          delete newErrors.petName;
        }
        break;

      case "petAge":
        if (!value || value <= 0) {
          newErrors.petAge = "Pet Age must be a positive number.";
        } else {
          delete newErrors.petAge;
        }
        break;

      case "petType":
        if (!value.trim()) {
          newErrors.petType = "Pet Type is required.";
        } else {
          delete newErrors.petType;
        }
        break;

      case "petBreed":
        if (!value.trim()) {
          newErrors.petBreed = "Pet Breed is required.";
        } else {
          delete newErrors.petBreed;
        }
        break;

      case "vaccineDates":
        if (!value.trim()) {
          newErrors.vaccineDates = "Vaccine Dates are required.";
        } else {
          delete newErrors.vaccineDates;
        }
        break;

      case "petOwnerName":
        if (!value.trim()) {
          newErrors.petOwnerName = "Owner Name is required.";
        } else {
          delete newErrors.petOwnerName;
        }
        break;

      case "ownerContactNumber":
        const phoneRegex = /^[0-9]{10}$/; // assuming a 10-digit phone number format
        if (!phoneRegex.test(value)) {
          newErrors.ownerContactNumber =
            "Contact Number must be a valid 10-digit number.";
        } else {
          delete newErrors.ownerContactNumber;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};

    // Validate all fields when submitting
    Object.keys(inputs).forEach((field) => {
      if (!inputs[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    setErrors(newErrors);

    // Return true if no errors exist, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form before submitting
    if (!validate()) {
      return; // If validation fails, prevent form submission
    }

    console.log("Pet Added:", inputs);
    sendRequest().then(() => history("/petdetails"));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/pets", {
        petName: String(inputs.petName),
        petAge: String(inputs.petAge),
        petType: String(inputs.petType),
        petBreed: String(inputs.petBreed),
        vaccineDates: String(inputs.vaccineDates),
        petOwnerName: String(inputs.petOwnerName),
        ownerContactNumber: String(inputs.ownerContactNumber),
      });

      // Show success toast
      toastContext.setToast("Pet added successfully!", Toast.SUCCESS);

      return res.data;
    } catch (error) {
      // Show error toast if the request fails
      toastContext.setToast(
        "Failed to add pet. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding pet:", error);
    }
  };

  return (
    <div
      className="form-container"
      style={{ maxWidth: "750px", marginTop: "5%" }}
    >
      <h1>Add Pet Details</h1>
      <form
        onSubmit={handleSubmit}
        className="doctor-form"
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={inputs.petName}
            onChange={handleChange}
          />
          {errors.petName && <p className="error">{errors.petName}</p>}

          <label>Pet Age:</label>
          <input
            type="number"
            name="petAge"
            value={inputs.petAge}
            onChange={handleChange}
          />
          {errors.petAge && <p className="error">{errors.petAge}</p>}

          <label>Pet Type:</label>
          <input
            type="text"
            name="petType"
            value={inputs.petType}
            onChange={handleChange}
          />
          {errors.petType && <p className="error">{errors.petType}</p>}

          <label>Pet Breed:</label>
          <input
            type="text"
            name="petBreed"
            value={inputs.petBreed}
            onChange={handleChange}
          />
          {errors.petBreed && <p className="error">{errors.petBreed}</p>}
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label>Vaccine Dates:</label>
          <input
            type="text"
            name="vaccineDates"
            value={inputs.vaccineDates}
            onChange={handleChange}
          />
          {errors.vaccineDates && (
            <p className="error">{errors.vaccineDates}</p>
          )}

          <label>Owner Name:</label>
          <input
            type="text"
            name="petOwnerName"
            value={inputs.petOwnerName}
            onChange={handleChange}
          />
          {errors.petOwnerName && (
            <p className="error">{errors.petOwnerName}</p>
          )}

          <label>Contact Number:</label>
          <input
            type="number"
            name="ownerContactNumber"
            value={inputs.ownerContactNumber}
            onChange={handleChange}
          />
          {errors.ownerContactNumber && (
            <p className="error">{errors.ownerContactNumber}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPet;
