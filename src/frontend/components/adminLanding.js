import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/adminLanding.css"; // Assuming you have a CSS file for styling

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalBloodDonors: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/metrics"
        );
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to load admin metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="admin-landing-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-logout" onClick={() => navigate("/")}>
          Logout
        </button>
      </header>

      {/* Metrics Section */}
      <section className="metrics-section">
        <h2>Overview</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Doctors</h3>
            <p>{metrics.totalDoctors}</p>
          </div>
          <div className="metric-card">
            <h3>Total Patients</h3>
            <p>{metrics.totalPatients}</p>
          </div>
          <div className="metric-card">
            <h3>Total Appointments</h3>
            <p>{metrics.totalAppointments}</p>
          </div>
          <div className="metric-card">
            <h3>Total Blood Donors</h3>
            <p>{metrics.totalBloodDonors}</p>
          </div>
          <div className="metric-card">
            <h3>Scheduled Appointments</h3>
            <p>{metrics.scheduledAppointments}</p>
          </div>
          <div className="metric-card">
            <h3>Completed Appointments</h3>
            <p>{metrics.completedAppointments}</p>
          </div>
          <div className="metric-card">
            <h3>Cancelled Appointments</h3>
            <p>{metrics.cancelledAppointments}</p>
          </div>
        </div>
      </section>

      {/* Management Sections */}
      <section className="management-section">
        <h2>Manage</h2>
        <div className="management-grid">
          <div
            className="management-card"
            onClick={() => navigate("/admin/doctors")}
          >
            <h3>Manage Doctors</h3>
            <p>View and manage all doctors in the system.</p>
          </div>
          <div
            className="management-card"
            onClick={() => navigate("/admin/userList")}
          >
            <h3>Manage Patients</h3>
            <p>View and manage all patients in the system.</p>
          </div>
          <div
            className="management-card"
            onClick={() => navigate("/admin/appointments")}
          >
            <h3>Manage Appointments</h3>
            <p>Track and manage all appointments.</p>
          </div>
          <div
            className="management-card"
            onClick={() => navigate("/admin/bloodDonors")}
          >
            <h3>Blood Donors</h3>
            <p>View and manage registered blood donors.</p>
          </div>
          <div
            className="management-card"
            onClick={() => navigate("/admin/reports")}
          >
            <h3>Generate Reports</h3>
            <p>Generate reports for appointments and donor requests.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLandingPage;
