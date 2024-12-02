import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/userAppointment.css";
import { Chip, Modal, TextField, Button, Rating } from "@mui/material";

const UserAppointments = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewError, setReviewError] = useState("");

  const handleScheduleAppointments = () => {
    navigate("/docAppointment", { state: { userData } });
  };

  const handleOpenReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setReviewText("");
    setRating(0); // Reset rating
  };

  const handleSubmitReview = async () => {
    if (reviewText.trim() === "" || rating === 0) {
      alert("Please provide both a review and a rating.");
      return;
    }

    try {
      // API call to save the review
      await axios.post(
        `https://emedical-backend.onrender.com/api/appointments/${selectedAppointment._id}/review`,
        {
          review: reviewText,
          rating,
        }
      );

      console.log("Review submitted:", { reviewText, rating });

      // Optionally update the appointment list with the new review (not shown in UI here)
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointment._id
            ? { ...appointment, review: reviewText, rating }
            : appointment
        )
      );

      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setReviewError(error.response.data.error); // Show error in modal
      } else {
        setReviewError("Failed to submit the review. Please try again.");
      }

      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `https://emedical-backend.onrender.com/api/appointments/user/${userData?._id}`
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
    (appointment) => appointment.status === "Completed"
  );
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  );

  const handleCancelAppointment = async (appointmentId) => {
    const cancellationNote = prompt("Please enter a cancellation note:");
    if (!cancellationNote) return;

    try {
      await axios.put(
        `https://emedical-backend.onrender.com/api/appointments/${appointmentId}/cancel`,
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
          marginLeft: "550px",
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
                  <div style={{ display: "flex", gap: "20px" }}>
                    <Chip label={appointment.status} />
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "30px",
                        width: "120px",
                        height: "30px",
                        fontSize: "12px",
                      }}
                      onClick={() => handleOpenReviewModal(appointment)}
                    >
                      Add Review
                    </Button>
                  </div>
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

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            backgroundColor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Add Review</h3>
          {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}

          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            label="Your Review"
            multiline
            rows={4}
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{ marginTop: "20px" }}
          />
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserAppointments;
