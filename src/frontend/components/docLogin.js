import React, { useState } from "react";
import axios from "axios";
import "../styling/docLogin.css";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDocSignUp = () => {
    navigate(`/DocSignup`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctor/login",
        loginDetails
      );
      setSuccessMessage(response.data.message);
      navigate(`/docLanding`, { state: { doctor: response.data.doctor } });
      setErrorMessage(""); // Clear error message
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Doctor login failed.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={loginDetails.email}
          onChange={handleLoginChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={loginDetails.password}
          onChange={handleLoginChange}
          required
        />

        <button className="login-btn" type="submit">
          Login
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p>Create an account </p>
          <h3
            className="signup-btnnn"
            style={{ color: "blue" }}
            onClick={handleDocSignUp}
          >
            SignUp
          </h3>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default DoctorLogin;
