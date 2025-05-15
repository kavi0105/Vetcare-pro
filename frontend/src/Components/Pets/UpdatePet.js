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
    email: "",
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
            email: res.data.pet.email,
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
        email: String(inputs.email),
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
        <div style={{ flex: 1, minWidth: "220px" }}>
          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={inputs.petName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="petAge"
            value={inputs.petAge}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />

          <label>Pet Type:</label>
          <select
            name="petType"
            value={inputs.petType}
            onChange={handleChange}
            required
            style={{
              width: "90%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              backgroundColor: "#ffffff6e",
              fontSize: "16px",
              color: "#333",
              marginBottom: "10px",
              marginLeft: "12px",
              marginTop: "3px",
              borderRadius: "4px",
              height: "40px",
            }}
          >
            <option value="">-- Select Pet Type --</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>

            <option value="Rabbit">Rabbit</option>
          </select>

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
            type="date"
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
            type="number"
            name="ownerContactNumber"
            value={inputs.ownerContactNumber}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
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
