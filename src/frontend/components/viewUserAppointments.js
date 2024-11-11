import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/userAppointment.css";
import { Chip } from "@mui/material";

const UserAppointments = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleScheduleAppointments = () => {
    navigate("/docAppointment", { state: { userData } });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/user/${userData?._id}`
        );
        setAppointments(response.data);
      } catch (error) {
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userData]);

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "Scheduled"
  );
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  );

  const handleCancelAppointment = async (appointmentId) => {
    const cancellationNote = prompt("Please enter a cancellation note:");
    if (!cancellationNote) return; // Exit if no note provided

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        { status: "Cancelled", notes: cancellationNote }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "Cancelled", notes: cancellationNote }
            : appointment
        )
      );
    } catch (error) {
      setError("Failed to cancel appointment. Please try again.");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
          marginRight: "30px",
          transform: "translateY(52px)",
        }}
      >
        <button onClick={handleScheduleAppointments}>
          Schedule Appointment
        </button>
      </div>
      <div className="appointments-container">
        <h2>Your Appointments</h2>

        <div className="appointments-section">
          <h3 style={{ marginBottom: "30px" }}>Scheduled</h3>
          {scheduledAppointments.length > 0 ? (
            <div className="appointments-grid">
              {scheduledAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  <div className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-info">
                    <p>Time: {appointment.time}</p>
                    <p>Doctor: {appointment.doctorName || "Unknown"}</p>
                    <p>Notes: {appointment.notes || "N/A"}</p>
                  </div>
                  <div
                    style={{ display: "flex", gap: "20px", marginTop: "20px" }}
                  >
                    <Chip label={appointment.status} />
                    <Chip
                      label="Cancel"
                      variant="filled"
                      color="error"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No scheduled appointments.</p>
          )}
        </div>

        <div className="appointments-section">
          <h3 style={{ marginBottom: "30px", marginTop: "30px" }}>Completed</h3>
          {completedAppointments.length > 0 ? (
            <div className="appointments-grid">
              {completedAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  <div className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-info">
                    <p>Time: {appointment.time}</p>
                    <p>Doctor: {appointment.doctorName || "Unknown"}</p>
                    <p>Notes: {appointment.notes || "N/A"}</p>
                  </div>
                  <Chip label={appointment.status} />
                </div>
              ))}
            </div>
          ) : (
            <p>No completed appointments.</p>
          )}
        </div>

        <div className="appointments-section" style={{ marginBottom: "30px" }}>
          <h3 style={{ marginBottom: "30px", marginTop: "30px" }}>Cancelled</h3>
          {cancelledAppointments.length > 0 ? (
            <div className="appointments-grid">
              {cancelledAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  <div className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-info">
                    <p>Time: {appointment.time}</p>
                    <p>Doctor: {appointment.doctorName || "Unknown"}</p>
                    <p>Notes: {appointment.notes || "N/A"}</p>
                  </div>
                  <Chip label={appointment.status} />
                </div>
              ))}
            </div>
          ) : (
            <p>No cancelled appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAppointments;
