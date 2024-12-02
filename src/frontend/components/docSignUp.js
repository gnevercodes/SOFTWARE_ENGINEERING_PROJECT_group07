import React, { useState } from "react";
import axios from "axios";
import "../styling/docSignup.css";
import { useNavigate } from "react-router-dom";

const DoctorSignup = () => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    specialty: "",
    licenseNumber: "",
    qualifications: "",
    experience: "",
    clinicAddress: "",
    bloodDonor: false,
    emergencyName: "",
    emergencyPhone: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://emedical-backend.onrender.com/api/doctor/signup",
        signupDetails
      );
      setSuccessMessage("Signup successful! Redirecting to login...");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/DocLogin");
      }, 2000);
    } catch (error) {
      setSuccessMessage("");
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Doctor signup failed.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Doctor Signup</h2>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
      )}
      <form className="signup-form" onSubmit={handleSignup}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={signupDetails.name}
          onChange={handleSignupChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={signupDetails.email}
          onChange={handleSignupChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={signupDetails.password}
          onChange={handleSignupChange}
          required
        />
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={signupDetails.phoneNumber}
          onChange={handleSignupChange}
          required
        />
        <label>Date of Birth</label>
        <input
          type="date"
          name="birthDate"
          value={signupDetails.birthDate}
          onChange={handleSignupChange}
          required
        />
        <label>Specialty</label>
        <input
          type="text"
          name="specialty"
          value={signupDetails.specialty}
          onChange={handleSignupChange}
          required
        />
        <label>License Number</label>
        <input
          type="text"
          name="licenseNumber"
          value={signupDetails.licenseNumber}
          onChange={handleSignupChange}
          required
        />
        <label>Qualifications</label>
        <input
          type="text"
          name="qualifications"
          value={signupDetails.qualifications}
          onChange={handleSignupChange}
          required
        />
        <label>Experience (Years)</label>
        <input
          type="number"
          name="experience"
          value={signupDetails.experience}
          onChange={handleSignupChange}
          required
        />
        <label>Clinic Address</label>
        <input
          type="text"
          name="clinicAddress"
          value={signupDetails.clinicAddress}
          onChange={handleSignupChange}
          required
        />
        <div className="checkbox-label">
          <input
            type="checkbox"
            name="bloodDonor"
            checked={signupDetails.bloodDonor}
            onChange={handleSignupChange}
          />
          <label>Sign up for blood donation</label>
        </div>
        <label>Emergency Contact Name</label>
        <input
          type="text"
          name="emergencyName"
          value={signupDetails.emergencyName}
          onChange={handleSignupChange}
          required
        />
        <label>Emergency Contact Phone</label>
        <input
          type="text"
          name="emergencyPhone"
          value={signupDetails.emergencyPhone}
          onChange={handleSignupChange}
          required
        />
        {successMessage && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </p>
        )}{" "}
        <button className="signup-btn" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default DoctorSignup;
