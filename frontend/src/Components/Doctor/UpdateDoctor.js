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
  const [inputs, setInputs] = useState({
    doctorId: "",
    name: "",
    specializedField: "",
    assignedPatients: "",
    availableSlot: "",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      await axios
        .get(`http://localhost:5000/doctors/${id}`)
        .then((res) => {
          setInputs({
            doctorId: res.data.doctor.doctorId,
            name: res.data.doctor.name,
            specializedField: res.data.doctor.specializedField,
            assignedPatients: res.data.doctor.assignedPatients,
            availableSlot: res.data.doctor.availableSlot,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchDoctor();
  }, [id]);

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/doctors/${id}`, {
        doctorId: String(inputs.doctorId),
        name: String(inputs.name),
        specializedField: String(inputs.specializedField),
        assignedPatients: String(inputs.assignedPatients),
        availableSlot: String(inputs.availableSlot),
      });

      toastContext.setToast("Doctor updated successfully!", Toast.SUCCESS);
      return res.data;
    } catch (error) {
      // Show error toast if the request fails
      toastContext.setToast(
        "Failed to add doctor. Please try again.",
        Toast.ERROR
      );
      console.error("Error adding doctor:", error);
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
    sendRequest().then(() => history("/doctordetails"));
  };

  return (
    <div class="form-container">
      <h1>Update Doctor</h1>
      <form onSubmit={handleSubmit} class="doctor-form">
        <label>Doctor ID:</label>
        <input
          type="text"
          name="doctorId"
          value={inputs.doctorId}
          onChange={handleChange}
          required
        />

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          required
        />

        <label>Specialized Field:</label>
        <input
          type="text"
          name="specializedField"
          value={inputs.specializedField}
          onChange={handleChange}
          required
        />

        <label>Assigned Patients:</label>
        <input
          type="number"
          name="assignedPatients"
          value={inputs.assignedPatients}
          onChange={handleChange}
          required
        />

        <label>Available Slot:</label>
        <input
          type="text"
          name="availableSlot"
          value={inputs.availableSlot}
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

export default UpdateDoctor;
