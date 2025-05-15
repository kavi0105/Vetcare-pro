import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function AddDoctor() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    doctorId: "",
    name: "Dr. ",
    specializedField: "",
    assignedPatients: "",
    email: "",
  });

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Create all 24-hour time slots
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push(
      `${hour.toString().padStart(2, "0")}:00`,
      `${hour.toString().padStart(2, "0")}:30`
    );
  }

  // Validation rules
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
        test: (value) => /^Dr\.\s?[a-zA-Z\s]+$/.test(value),
        message: "Name should start with 'Dr.' followed by letters and spaces only.",
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
        test: (value) => /^[0-9]{9}$/.test(value),
        message: "Contact number must be exactly 9 digits.",
      },
    ],
    email: [
      { test: (value) => value.trim(), message: "Email is required." },
      {
        test: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: "Please enter a valid email address.",
      },
    ],
  };

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
    let { name, value } = e.target;

    if (name === "assignedPatients") {
      if (value.startsWith("0")) {
        value = value.substring(1);
      }
      value = value.slice(0, 9);
    }

    if (name === "name") {
      if (!value.startsWith("Dr. ")) {
        value = "Dr. " + value.replace(/^Dr\.?\s*/, "");
      }
    }

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

    if (selectedSlots.length === 0) {
      formErrors.availableSlot = "Please select at least one available slot.";
    } else if (selectedSlots.length > 2) {
      formErrors.availableSlot = "You can select only 2 slots.";
    }

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

    const finalInputs = {
      ...inputs,
      name: inputs.name.startsWith("Dr. ") ? inputs.name : "Dr. " + inputs.name,
      availableSlot: selectedSlots.join(" - "),
    };

    console.log("Doctor Added:", finalInputs);
    setLoading(true);
    sendRequest(finalInputs).then(() => {
      setLoading(false);
      history("/doctordetails");
    });
  };

  const sendRequest = async (finalInputs) => {
    try {
      const res = await axios.post("http://localhost:5000/doctors", {
        doctorId: String(finalInputs.doctorId),
        name: String(finalInputs.name),
        specializedField: String(finalInputs.specializedField),
        assignedPatients: String(finalInputs.assignedPatients),
        availableSlot: String(finalInputs.availableSlot),
        email: String(finalInputs.email),
      });

      toastContext.setToast("Doctor added successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      toastContext.setToast(
        "Failed to add doctor. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding doctor:", error);
      setLoading(false);
    }
  };

  const toggleSlot = (slot) => {
    const newSelectedSlots = [...selectedSlots];
    if (newSelectedSlots.includes(slot)) {
      setSelectedSlots(newSelectedSlots.filter((s) => s !== slot));
    } else {
      if (newSelectedSlots.length < 2) {
        setSelectedSlots([...newSelectedSlots, slot]);
      } else {
        toastContext.setToast("You can select only 2 slots.", Toast.WARNING);
      }
    }
  };

  return (
    <div style={styles.formContainer}>
      <h1 style={{ marginTop: "3px" }}>Add Doctor</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputContainer}>
            <label>Doctor ID:</label>
            <input
              type="text"
              name="doctorId"
              value={inputs.doctorId}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.doctorId && <p style={styles.error}>{errors.doctorId}</p>}
          </div>
          <div style={styles.inputContainer}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputContainer}>
            <label>Specialized Field:</label>
            <input
              type="text"
              name="specializedField"
              value={inputs.specializedField}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.specializedField && (
              <p style={styles.error}>{errors.specializedField}</p>
            )}
          </div>
          <div style={styles.inputContainer}>
            <label>Contact Number:</label>
            <input
              type="number"
              name="assignedPatients"
              value={inputs.assignedPatients}
              onChange={handleChange}
              style={styles.input}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.assignedPatients && (
              <p style={styles.error}>{errors.assignedPatients}</p>
            )}
          </div>
        </div>

        <div style={styles.inputContainer}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <label>Available Slots:</label>
        <div style={styles.slotGrid}>
          {timeSlots.map((slot) => (
            <div
              key={slot}
              style={{
                ...styles.slot,
                ...(selectedSlots.includes(slot) ? styles.selectedSlot : {}),
              }}
              onClick={() => toggleSlot(slot)}
            >
              {slot}
            </div>
          ))}
        </div>
        {errors.availableSlot && (
          <p style={styles.error}>{errors.availableSlot}</p>
        )}

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {loading && <div style={styles.spinner}></div>}
    </div>
  );
}

const styles = {
  formContainer: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "10px",
    backgroundColor: " rgba(255, 255, 255, 0.62)",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  inputContainer: {
    flex: "0 0 48%", // Take up 48% of the row width
  },
  input: {
    padding: "5px",
    marginBottom: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "13px",
    backgroundColor: " rgba(255, 255, 255, 0.62)",
    width: "100%", // Ensure inputs fill their containers
  },
  error: {
    color: "red",
    marginBottom: "6px",
    fontSize: "11px",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    padding: "8px",
  },
  slot: {
    padding: "4px 2px",
    fontSize: "12px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    userSelect: "none",
  },
  selectedSlot: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  submitButton: {
    padding: "8px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 2s linear infinite",
    marginTop: "15px",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default AddDoctor;
