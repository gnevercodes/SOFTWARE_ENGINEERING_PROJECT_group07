import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/docDoctorAppointments.css";

const DocDoctorAppointments = () => {
  const location = useLocation();
  const { doctor } = location.state || {};
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/doctor/${doctor._id}`
        );
        setAppointments(response.data);
        setFilteredAppointments(response.data); // Initialize with all appointments
      } catch (error) {
        setError("Failed to load appointments. Please try again later.");
      }
    };

    fetchAppointments();
  }, [doctor]);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [startDate, endDate, appointments]);

  const handleCancelAppointment = async (appointmentId) => {
    const cancellationNote = prompt("Please enter a cancellation note:");
    if (!cancellationNote) return;

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

  const scheduledAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "Scheduled"
  );
  const completedAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "completed"
  );
  const cancelledAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "Cancelled"
  );

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Doctor's Appointments</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Date filter section */}
      <div className="date-filter">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          customInput={<TextField label="Start Date" variant="outlined" />}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          customInput={<TextField label="End Date" variant="outlined" />}
        />
        <Button
          variant="contained"
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Clear Filter
        </Button>
      </div>

      {/* Appointments sections */}
      <div className="appointments-section">
        <h3 className="appointment-section-title">Scheduled</h3>
        <div className="appointment-section">
          {scheduledAppointments.length > 0 ? (
            <div className="appointment-cards-container">
              {scheduledAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  <div className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-info">
                    <p>Time: {appointment.time}</p>
                    <p>Patient: {appointment.patientName}</p>
                    <p>Notes: {appointment.notes || "No notes available"}</p>
                  </div>
                  <div className="status-chip status-scheduled">Scheduled</div>
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No scheduled appointments.</p>
          )}
        </div>
      </div>

      {/* Completed and Cancelled sections */}
      <div className="appointments-section">
        <h3 className="appointment-section-title">Completed</h3>
        {completedAppointments.length > 0 ? (
          <div className="appointment-cards-container">
            {completedAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment._id}>
                <div className="appointment-date">
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="appointment-info">
                  <p>Time: {appointment.time}</p>
                  <p>Patient: {appointment.patientName}</p>
                  <p>Notes: {appointment.notes || "No notes available"}</p>
                </div>
                <div className="status-chip status-completed">Completed</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No completed appointments.</p>
        )}
      </div>

      <div className="appointments-section">
        <h3 className="appointment-section-title">Cancelled</h3>
        {cancelledAppointments.length > 0 ? (
          <div className="appointment-cards-container">
            {cancelledAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment._id}>
                <div className="appointment-date">
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="appointment-info">
                  <p>Time: {appointment.time}</p>
                  <p>Patient: {appointment.patientName}</p>
                  <p>Notes: {appointment.notes || "No notes available"}</p>
                </div>
                <div className="status-chip status-cancelled">Cancelled</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No cancelled appointments.</p>
        )}
      </div>
    </div>
  );
};

export default DocDoctorAppointments;
