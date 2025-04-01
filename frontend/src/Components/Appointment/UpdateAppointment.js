import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "../../Styles/UpdateDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function UpdateAppointment() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const id = useParams().id;
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
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
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/appointments/${id}`);
        const appointment = res.data.appointment;
        setInputs({
          name: appointment.name,
          contactNumber: appointment.contactNumber,
          petName: appointment.petName,
          petType: appointment.petType,
          petAge: appointment.petAge,
          appointmentTime: appointment.appointmentTime,
          appointmentDate: appointment.appointmentDate,
        });
        setSelectedDoctor(appointment.doctorName);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/doctors");
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAppointment();
    fetchDoctors();
  }, [id]);

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/appointments/${id}`, {
        name: String(inputs.name),
        contactNumber: Number(inputs.contactNumber),
        petName: String(inputs.petName),
        petType: String(inputs.petType),
        petAge: Number(inputs.petAge),
        appointmentTime: String(inputs.appointmentTime),
        appointmentDate: String(inputs.appointmentDate),
        doctorName: selectedDoctor,
      });

      toastContext.setToast("Appointment updated successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      toastContext.setToast(
        "Failed to update appointment. Please try again.",
        Toast.ERROR
      );
      console.error("Error updating appointment:", error);
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/appointmentdetails"));
  };

  return (
    <div class="form-container" style={{ maxWidth: "750px", marginTop: "5%" }}>
      <h1>Update Appointment</h1>
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
            required
            style={{ width: "90%" }}
          />

          <label>Contact Number:</label>
          <input
            type="number"
            name="contactNumber"
            value={inputs.contactNumber}
            onChange={handleChange}
            required
            style={{ width: "90%" }}
          />

          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={inputs.petName}
            onChange={handleChange}
            required
            style={{ width: "90%" }}
          />

          <label>Pet Type:</label>
          <input
            type="text"
            name="petType"
            value={inputs.petType}
            onChange={handleChange}
            required
            style={{ width: "90%" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label>Pet Age:</label>
          <input
            type="number"
            name="petAge"
            value={inputs.petAge}
            onChange={handleChange}
            required
            style={{ width: "87%" }}
          />

          <label>Appointment Time:</label>
          <input
            type="text"
            name="appointmentTime"
            value={inputs.appointmentTime}
            onChange={handleChange}
            required
            style={{ width: "87%" }}
          />

          <label>Appointment Date:</label>
          <input
            type="text"
            name="appointmentDate"
            value={inputs.appointmentDate}
            onChange={handleChange}
            required
            style={{ width: "87%" }}
          />

          <label>Doctor Name:</label>
          <select
            name="doctorName"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            required
            style={{
              width: "92%",
              marginLeft: "12px",
              height: "40px",
              opacity: "0.8",
            }}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
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

export default UpdateAppointment;
