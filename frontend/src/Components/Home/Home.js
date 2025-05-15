"use client";

import React from "react";
import "../../Styles/Home.css"; // Import the external CSS file
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleBookNow = () => {
    navigate("/addappointment"); // Correct function call
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>
          Welcome to <span className="highlight-text">VetCarePro</span>
        </h1>
        <p>Your pet's health is our priority!</p>
      </header>

      <div className="home-content">
        <section className="appointment-section">
          <h2>Book an Appointment</h2>
          <p>Schedule a visit for your pet today!</p>
          <button className="appointment-button" onClick={handleBookNow}>
            Book Now
          </button>
        </section>

        <section className="service-section">
          <h2>Our Services</h2>
          <ul className="service-list">
            <li>Health Check-ups</li>
            <li>Vaccinations</li>
            <li>Surgery</li>
            <li>Pet Grooming</li>
            <li>Emergency Services</li>
          </ul>
        </section>

        <section className="contact-section">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out!</p>
          <button className="contact-button">Contact Us</button>
        </section>
      </div>

      <footer className="home-footer">
        <p>&copy; 2025 VetCarePro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
