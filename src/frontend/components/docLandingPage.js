import { React, useState, useEffect } from "react";
import "../styling/docLanding.css";
import { useLocation, useNavigate } from "react-router-dom";
import docAppointment from "../assets/docAppointment.png";
import doctors from "../assets/doctors.png";
import docNew from "../assets/docNew.png";
import axios from "axios";

const DoctorLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor } = location.state || {};
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // Additional state to store counts for appointment statuses
  const [appointmentCounts, setAppointmentCounts] = useState({
    totalAppointments: 0,
    totalScheduled: 0,
    totalCompleted: 0,
    totalCancelled: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/doctor/${doctor._id}`
        );
        const appointments = response.data;

        // Calculate totals for each status
        const totalScheduled = appointments.filter(
          (app) => app.status === "Scheduled"
        ).length;
        const totalCompleted = appointments.filter(
          (app) => app.status === "completed"
        ).length;
        const totalCancelled = appointments.filter(
          (app) => app.status === "Cancelled"
        ).length;

        setAppointments(appointments);
        setAppointmentCounts({
          totalAppointments: appointments.length,
          totalScheduled,
          totalCompleted,
          totalCancelled,
        });
      } catch (error) {
        setError("Failed to load appointments. Please try again later.");
      }
    };

    fetchAppointments();
  }, [doctor]);

  const handleViewAppointments = () => {
    navigate(`/docDocAppointments`, { state: { doctor } });
  };

  return (
    <div className="doctor-landing-container">
      <nav className="navbar">
        <div className="logo">
          <h2>eMed</h2>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#appointments">Appointments</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button className="btn-login">Logout</button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome, Dr {doctor?.name || "Doctor"}</h1>
          <p>
            Thank you for your dedication and tireless service in providing care
            to your patients. We deeply appreciate your efforts!
          </p>
        </div>
        <div className="hero-image">
          <img src={docNew} alt="Doctor at work" />
        </div>
      </section>

      <section className="metrics-section">
        <h2>Doctor Dashboard</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Appointments</h3>
            <p>{appointmentCounts.totalAppointments}</p>
          </div>
          <div className="metric-card">
            <h3>Upcoming Appointments</h3>
            <p>{appointmentCounts.totalScheduled}</p>
          </div>
          <div className="metric-card">
            <h3>Treated Patients</h3>
            <p>{appointmentCounts.totalCompleted}</p>
          </div>
          <div className="metric-card">
            <h3>Cancelled Appointments</h3>
            <p>{appointmentCounts.totalCancelled}</p>
          </div>
        </div>
      </section>

      <section id="appointments" className="features-section">
        <h2>Appointments</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <p>Manage your appointments and stay organized for better care.</p>
            <button className="btn-primary" onClick={handleViewAppointments}>
              View Appointments
            </button>
          </div>
          <div>
            <img src={docAppointment} alt="Manage Appointments" />
          </div>
        </div>
      </section>

      <footer id="contact" className="footer">
        <p>&copy; 2024 eMed. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default DoctorLandingPage;
