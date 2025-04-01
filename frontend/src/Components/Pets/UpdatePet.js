import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "../../Styles/UpdateDoctor.css";
import { ToastContext } from "../Contexts/toast.context";
import { Toast } from "../Enum/toast";

function UpdatePet() {
  const toastContext = useContext(ToastContext);
  const history = useNavigate();
  const id = useParams().id;
  const [inputs, setInputs] = useState({
    petName: "",
    petAge: "",
    petType: "",
    petBreed: "",
    vaccineDates: "",
    petOwnerName: "",
    ownerContactNumber: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      await axios
        .get(`http://localhost:5000/pets/${id}`)
        .then((res) => {
          setInputs({
            petName: res.data.pet.petName,
            petAge: res.data.pet.petAge,
            petType: res.data.pet.petType,
            petBreed: res.data.pet.petBreed,
            vaccineDates: res.data.pet.vaccineDates,
            petOwnerName: res.data.pet.petOwnerName,
            ownerContactNumber: res.data.pet.ownerContactNumber,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchPet();
  }, [id]);

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/pets/${id}`, {
        petName: String(inputs.petName),
        petAge: String(inputs.petAge),
        petType: String(inputs.petType),
        petBreed: String(inputs.petBreed),
        vaccineDates: String(inputs.vaccineDates),
        petOwnerName: String(inputs.petOwnerName),
        ownerContactNumber: String(inputs.ownerContactNumber),
      });

      toastContext.setToast("Pet updated successfully!", Toast.SUCCESS);
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
    sendRequest().then(() => history("/petdetails"));
  };

  return (
    <div
      className="form-container"
      style={{ maxWidth: "750px", marginTop: "5%" }}
    >
      <h1>Update Pet Details</h1>
      <form
        onSubmit={handleSubmit}
        className="doctor-form"
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        <div style={{ flex: 1, minWidth: "220px", }}>
          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={inputs.petName}
            onChange={handleChange}
            required
          />

          <label>Pet Age:</label>
          <input
            type="number"
            name="petAge"
            value={inputs.petAge}
            onChange={handleChange}
            required
          />

          <label>Pet Type:</label>
          <input
            type="text"
            name="petType"
            value={inputs.petType}
            onChange={handleChange}
            required
          />

          <label>Pet Breed:</label>
          <input
            type="text"
            name="petBreed"
            value={inputs.petBreed}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
        <label>Vaccine Dates:</label>
        <input
          type="text"
          name="vaccineDates"
          value={inputs.vaccineDates}
          onChange={handleChange}
          required
        />

        <label>Owner Name:</label>
        <input
          type="text"
          name="petOwnerName"
          value={inputs.petOwnerName}
          onChange={handleChange}
          required
        />

        <label>Contact Number:</label>
        <input
          type="text"
          name="ownerContactNumber"
          value={inputs.ownerContactNumber}
          onChange={handleChange}
          required
        />
        </div>

        <button type="submit" class="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdatePet;
