import React, { useState } from "react";
import "../styling/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageScreen from "./messageScreen";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup Form State
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    bloodGroup: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyName: "",
    emergencyPhone: "",
    isDonor: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setLoggedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDonorChange = (e) => {
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      isDonor: e.target.checked,
    }));
  };
  const displayMessageAndNavigate = (message, userData) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/landing", { state: { userData } });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginApi({
        email: loginEmail,
        password: loginPassword,
      });
      console.log("data", data);

      setLoggedUser(data.user);
      const userData = data.user.user;
      setLoginError("");
      displayMessageAndNavigate("Login Successful!", data.user.user);

      // Set user in state

      // Navigate to landing page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await signupApi(signupDetails);
      setLoggedUser({ name: signupDetails.name });
      console.log(data, "signupData");
      const userData = signupDetails;

      if (data) {
        navigate("/landing", { state: { userData } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginApi = async (loginData) => {
    try {
      const response = await axios.post(
        "https://emedical-backend.onrender.com/api/login",
        loginData
      );
      // console.log(response);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        setLoginError(error.response.data.error);
      }

      throw new Error(error.response?.data?.error || "Login failed.");
    }
  };

  const signupApi = async (signupData) => {
    console.log(signupData);
    try {
      const response = await axios.post(
        "https://emedical-backend.onrender.com/api/signup",
        signupData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signup failed.");
    }
  };

  if (successMessage) {
    return <MessageScreen message={successMessage} />;
  }
  return (
    <>
      <div className="wrapper ">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  {loginError.length > 0 && (
                    <p style={{ color: "red" }}>{loginError}</p>
                  )}

                  <button className="flip-card__btn" onClick={handleLogin}>
                    Let’s go!
                  </button>
                </form>
              </div>

              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input
                    className="flip-card__input"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={signupDetails.name}
                    onChange={handleSignupChange}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    {" "}
                    <input
                      className="flip-card__input"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={signupDetails.email}
                      onChange={handleSignupChange}
                    />
                    <input
                      className="flip-card__input"
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={signupDetails.password}
                      onChange={handleSignupChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    {" "}
                    <input
                      className="flip-card__input"
                      name="phone"
                      placeholder="Phone Number"
                      type="text"
                      value={signupDetails.phone}
                      onChange={handleSignupChange}
                    />
                    <input
                      className="flip-card__input"
                      name="birthDate"
                      placeholder="Date of Birth"
                      type="date"
                      value={signupDetails.birthDate}
                      onChange={handleSignupChange}
                    />
                  </div>
                  <select
                    className="flip-card__input"
                    name="bloodGroup"
                    value={signupDetails.bloodGroup}
                    style={{ width: "270px", height: "50px" }}
                    onChange={handleSignupChange}
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    {" "}
                    <input
                      className="flip-card__input"
                      name="street"
                      placeholder="Street"
                      type="text"
                      value={signupDetails.street}
                      onChange={handleSignupChange}
                    />
                    <input
                      className="flip-card__input"
                      name="city"
                      placeholder="City"
                      type="text"
                      value={signupDetails.city}
                      onChange={handleSignupChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    <input
                      className="flip-card__input"
                      name="state"
                      placeholder="State"
                      type="text"
                      value={signupDetails.state}
                      onChange={handleSignupChange}
                    />
                    <input
                      className="flip-card__input"
                      name="zipCode"
                      placeholder="Zip Code"
                      type="text"
                      value={signupDetails.zipCode}
                      onChange={handleSignupChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    <input
                      className="flip-card__input"
                      name="emergencyName"
                      placeholder="Emergency Contact Name"
                      type="text"
                      value={signupDetails.emergencyName}
                      onChange={handleSignupChange}
                    />
                    <input
                      className="flip-card__input"
                      name="emergencyPhone"
                      placeholder="Emergency Contact Phone"
                      type="text"
                      value={signupDetails.emergencyPhone}
                      onChange={handleSignupChange}
                    />
                  </div>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={signupDetails.isDonor}
                          onChange={handleDonorChange}
                        />
                      }
                      label="Sign up as a Blood Donor"
                    />
                  </FormGroup>
                  <button className="flip-card__btn" onClick={handleSignup}>
                    Confirm!
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>

        {/* {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>} */}
      </div>
    </>
  );
};

export default Login;
