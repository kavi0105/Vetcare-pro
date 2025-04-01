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
    name: "",
    staffId: "",
    age: 0, // Initialized as a number
    jobRole: "",
    salary: 0, // Initialized as a number
  });

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/staffs/${id}`);
        console.log(res.data.staff); // Check if age and salary are numbers
        setInputs({
          name: res.data.staff.name,
          staffId: res.data.staff.staffId,
          age: Number(res.data.staff.age), // Ensure it's stored as a number
          jobRole: res.data.staff.jobRole,
          salary: Number(res.data.staff.salary), // Ensure it's stored as a number
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchStaffs();
  }, [id]);
  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/staffs/${id}`, {
        name: String(inputs.name),
        staffId: String(inputs.staffId),
        age: Number(inputs.age),
        jobRole: String(inputs.jobRole),
        salary: Number(inputs.salary),
      });

      toastContext.setToast("Staff updated successfully!", Toast.SUCCESS);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: name === "age" || name === "salary" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/staffdetails"));
  };

  return (
    <div class="form-container">
      <h1>Update Staff</h1>
      <form onSubmit={handleSubmit} class="doctor-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          required
        />

        <label>Staff ID:</label>
        <input
          type="text"
          name="staffId"
          value={inputs.staffId}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={inputs.age.toString()}
          onChange={handleChange}
          required
        />

        <label>Job Role:</label>
        <input
          type="text"
          name="jobRole"
          value={inputs.jobRole}
          onChange={handleChange}
          required
        />

        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={inputs.salary.toString()}
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
