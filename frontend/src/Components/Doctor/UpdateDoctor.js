import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "../../Styles/UpdateDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function UpdateDoctor() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const id = useParams().id;
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    doctorId: "",
    name: "Dr. ",
    specializedField: "",
    assignedPatients: "",
    availableSlot: "",
    email: "",
  });

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [errors, setErrors] = useState({});

  // Create all 24-hour time slots
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push(
      `${hour.toString().padStart(2, "0")}:00`,
      `${hour.toString().padStart(2, "0")}:30`
    );
  }

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}`);
        const doctorData = res.data.doctor;
        setInputs({
          doctorId: doctorData.doctorId,
          name: doctorData.name.startsWith("Dr.")
            ? doctorData.name
            : `Dr. ${doctorData.name}`,
          specializedField: doctorData.specializedField,
          assignedPatients: doctorData.assignedPatients,
          availableSlot: doctorData.availableSlot,
          email: doctorData.email,
        });

        if (doctorData.availableSlot) {
          setSelectedSlots(doctorData.availableSlot.split(" - "));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignedPatients") {
      let input = value.replace(/\D/g, ""); // Remove non-digit characters

      // Remove leading zeros
      input = input.replace(/^0+/, "");

      // Limit to 9 digits
      if (input.length > 9) {
        input = input.slice(0, 9);
      }

      setInputs((prevState) => ({
        ...prevState,
        [name]: input,
      }));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      if (selectedSlots.length < 2) {
        setSelectedSlots([...selectedSlots, slot]);
      } else {
        toastContext.setToast("You can select only 2 slots.", Toast.WARNING);
      }
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!inputs.doctorId.trim()) {
      formErrors.doctorId = "Doctor ID is required.";
    }

    if (!inputs.name.trim()) {
      formErrors.name = "Name is required.";
    } else if (!/^Dr\.\s?[A-Za-z\s]+$/.test(inputs.name.trim())) {
      formErrors.name =
        "Name must start with 'Dr.' followed by letters and spaces only.";
    }

    if (!inputs.specializedField.trim()) {
      formErrors.specializedField = "Specialized Field is required.";
    }

    if (!inputs.assignedPatients.toString().trim()) {
      formErrors.assignedPatients = "Contact number is required.";
    } else if (!/^\d{9}$/.test(inputs.assignedPatients.toString().trim())) {
      formErrors.assignedPatients = "Contact number must be exactly 9 digits.";
    }

    if (!inputs.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs.email.trim())
    ) {
      formErrors.email = "Invalid email address.";
    }

    if (selectedSlots.length === 0) {
      formErrors.availableSlot = "Please select at least one available slot.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const sendRequest = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/doctors/${id}`, {
        doctorId: String(inputs.doctorId),
        name: inputs.name.startsWith("Dr.")
          ? inputs.name
          : `Dr. ${inputs.name}`,
        specializedField: String(inputs.specializedField),
        assignedPatients: String(inputs.assignedPatients),
        availableSlot: selectedSlots.join(" - "),
        email: String(inputs.email),
      });

      toastContext.setToast("Doctor updated successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      toastContext.setToast(
        "Failed to update doctor. Please try again.",
        Toast.ERROR
      );
      console.error("Error updating doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toastContext.setToast(
        "Please fix the errors before submitting.",
        Toast.ERROR
      );
      return;
    }

    sendRequest().then(() => history("/doctordetails"));
  };

  return (
    <div class="form-container">
      {loading ? (
        <div style={styles.loadingSpinner}></div>
      ) : (
        <>
          <h1 style={{ marginTop: "-1px" }}>Update Doctor</h1>
          <form onSubmit={handleSubmit} class="doctor-form">
            <label style={styles.label}>Doctor ID:</label>
            <input
              type="text"
              name="doctorId"
              value={inputs.doctorId}
              onChange={handleChange}
              style={styles.input}
            />

            {errors.doctorId && <p style={styles.error}>{errors.doctorId}</p>}

            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}

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

            <label>Contact Number:</label>
            <input
              type="number"
              name="assignedPatients"
              value={inputs.assignedPatients}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              style={styles.input}
            />
            {errors.assignedPatients && (
              <p style={styles.error}>{errors.assignedPatients}</p>
            )}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              style={styles.input}
              disabled
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}

            <label>Available Slots:</label>
            <div style={styles.slotGrid}>
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  style={{
                    ...styles.slot,
                    ...(selectedSlots.includes(slot)
                      ? styles.selectedSlot
                      : {}),
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

            <button
              type="submit"
              style={styles.submitButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
}

const styles = {
  formContainer: {
    width: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  doctorForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "2px",
  },
  input: {
    padding: "6px 8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  submitButton: {
    padding: "5px 10px",
    backgroundColor: "#4caf50",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
    alignItems: "center",
  },
  submitButtonHover: {
    backgroundColor: "#45a049",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(40px, 1fr))",
    gap: "4px",
    marginTop: "8px",
  },
  slot: {
    padding: "4px 0px",
    fontSize: "11px",
    backgroundColor: "#e0e0e0",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    userSelect: "none",
  },
  selectedSlot: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "2px",
  },

  // Updated styles for loading spinner without container
  loadingSpinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "4px solid #f3f3f3" /* Light gray */,
    borderTop: "4px solid #3498db" /* Blue */,
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
  },
};

// Keyframes for spinning animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);

export default UpdateDoctor;
