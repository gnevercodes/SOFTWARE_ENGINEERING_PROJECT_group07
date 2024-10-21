import Login from "./frontend/components/login.js";
import logo from "./logo.svg";
import MedicalLandingPage from "./frontend/components/landinPage.js";
import CartPage from "./frontend/components/cart.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MedicinePage from "./frontend/components/medicines.js";
import React, { useState } from "react";
import DoctorAppointment from "./frontend/components/docAppointment.js";

function App() {
  return (
    // <div className="App">
    //   {/* <Login /> */}
    //   <MedicalLandingPage />
    // </div>

    <Router>
      <Routes>
        <Route path="/" element={<MedicalLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<MedicalLandingPage />} />
        <Route path="/medicines" element={<MedicinePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/docAppointment" element={<DoctorAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
