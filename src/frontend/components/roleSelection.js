import React from "react";
import "../styling/roleSelection.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
const RoleSelection = () => {
  const navigate = useNavigate();
  const handlePatientClick = () => {
    navigate(`/PatientLanding`);
  };

  const handleDocClick = () => {
    navigate(`/docLogin`);
  };

  const handleAdminClick = () => {
    navigate(`/adminLogin`);
  };
  return (
    <div className="container">
      <div className="left-half left">
        <button className="doctor-btn" onClick={handleDocClick}>
          Doctor
        </button>
      </div>
      <div>
        <button className="admin-btn" onClick={handleAdminClick}>
          Admin
        </button>
      </div>
      <div className="right-half right">
        <button className="patient-btn" onClick={handlePatientClick}>
          Patient
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
