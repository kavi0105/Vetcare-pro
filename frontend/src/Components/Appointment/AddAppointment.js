import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../Styles/AddDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

const URL = "http://localhost:5000/doctors";

function AddAppointment() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    name: "",
    contactNumber: "",
    petName: "",
    petType: "",
    petAge: "",
    appointmentTime: "",
    appointmentDate: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(URL);
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // Validate the changed input field
    validateField(e.target.name, e.target.value);
  };

  // Validation function
  const validateField = (fieldName, value) => {
    let errorMsg = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) errorMsg = "Pet owner name is required.";
        else if (!/^[A-Za-z\s]+$/.test(value))
          errorMsg = "Name must contain only letters.";
        break;
      case "contactNumber":
        if (!value.trim()) errorMsg = "Contact number is required.";
        else if (!/^\d{10}$/.test(value))
          errorMsg = "Enter a valid 10-digit phone number.";
        break;
      case "petName":
        if (!value.trim()) errorMsg = "Pet name is required.";
        break;
      case "petType":
        if (!value.trim()) errorMsg = "Pet type is required.";
        break;
      case "petAge":
        if (!value.trim()) errorMsg = "Pet age is required.";
        else if (!/^\d+$/.test(value) || parseInt(value) <= 0)
          errorMsg = "Enter a valid pet age.";
        break;
      case "appointmentTime":
        if (!value.trim()) errorMsg = "Appointment time is required.";
        else if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(value))
          errorMsg = "Enter time in HH:MM format.";
        break;
      case "appointmentDate":
        if (!value.trim()) errorMsg = "Appointment date is required.";
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
          errorMsg = "Enter date in YYYY-MM-DD format.";
        break;
      case "selectedDoctor":
        if (!value) errorMsg = "Please select a doctor.";
        break;
      default:
        break;
    }

    // Update errors state with error message for this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMsg,
    }));

    return errorMsg; // Return error message for each field
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate each field individually
    Object.keys(inputs).forEach((key) => {
      const errorMsg = validateField(key, inputs[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    // Validate doctor selection
    const doctorError = validateField("selectedDoctor", selectedDoctor);
    if (doctorError) {
      newErrors.selectedDoctor = doctorError;
      isValid = false;
    }

    setErrors(newErrors); // Update errors state with all errors
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    if (!validateForm()) {
      toastContext.setToast(
        "Please fix validation errors before submitting.",
        Toast.ERROR
      );
      return; // Prevent submission if there are validation errors
    }

    try {
      const res = await axios.post("http://localhost:5000/appointments", {
        ...inputs,
        doctorName: selectedDoctor,
      });
      toastContext.setToast("Appointment added successfully!", Toast.SUCCESS);
      history("/appointmentdetails"); // Redirect on success
      return res.data;
    } catch (error) {
      toastContext.setToast(
        "Failed to add appointment. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div
      className="form-container"
      style={{ maxWidth: "750px", marginTop: "5%" }}
    >
      <h1>Create Appointment</h1>
      <form
        onSubmit={handleSubmit}
        className="doctor-form"
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label>Pet Owner:</label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <label>Contact Number:</label>
          <input
            type="number"
            name="contactNumber"
            value={inputs.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && (
            <p className="error">{errors.contactNumber}</p>
          )}

          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={inputs.petName}
            onChange={handleChange}
          />
          {errors.petName && <p className="error">{errors.petName}</p>}

          <label>Pet Type:</label>
          <input
            type="text"
            name="petType"
            value={inputs.petType}
            onChange={handleChange}
          />
          {errors.petType && <p className="error">{errors.petType}</p>}
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label>Pet Age:</label>
          <input
            type="number"
            name="petAge"
            value={inputs.petAge}
            onChange={handleChange}
          />
          {errors.petAge && <p className="error">{errors.petAge}</p>}

          <label>Appointment Time:</label>
          <input
            type="text"
            name="appointmentTime"
            value={inputs.appointmentTime}
            onChange={handleChange}
          />
          {errors.appointmentTime && (
            <p className="error">{errors.appointmentTime}</p>
          )}

          <label>Appointment Date:</label>
          <input
            type="text"
            name="appointmentDate"
            value={inputs.appointmentDate}
            onChange={handleChange}
          />
          {errors.appointmentDate && (
            <p className="error">{errors.appointmentDate}</p>
          )}

          <label>Doctor:</label>
          <select
            value={selectedDoctor}
            onChange={handleDoctorChange}
            style={{
              width: "96%",
              marginLeft: "12px",
              height: "40px",
              opacity: "0.7",
            }}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
          {errors.selectedDoctor && (
            <p className="error">{errors.selectedDoctor}</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          style={{ width: "20%", marginTop: "20px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddAppointment;
