import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/appointment.css";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Container,
  Grid,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";

const DoctorAppointment = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const location = useLocation();
  const { userData } = location.state || {};
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    patientId: userData._id,
    date: "",
    time: "",
    doctorId: "",
    doctorName: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDoctors = async () => {
    try {
      const response = await axios.get(
        "https://emedical-backend.onrender.com/api/doctors"
      );
      setDoctorsList(response.data);
    } catch (error) {
      setError("Failed to load doctors. Please try again later.");
      console.error(error);
    }
  };

  const bookAppointment = async () => {
    console.log(formData);
    try {
      const response = await axios.post(
        "https://emedical-backend.onrender.com/api/appointments",
        formData
      );
      console.log("Appointment booked successfully:", response.data);
      setIsSubmitted(true);
      // setTimeout(() => {
      //   navigate(`/userAppointments`, { state: { userData } });
      // }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to book appointment");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorId") {
      const selectedDoctor = doctorsList.find((doctor) => doctor._id === value);
      setFormData((prevData) => ({
        ...prevData,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    bookAppointment();
  };

  const handleViewAppointments = () => {
    navigate(`/userAppointments`, { state: { userData } });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/userAppointments", { state: { userData } });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
          marginRight: "30px",
          transform: "translate(60px)",
        }}
      >
        {!isSubmitted && (
          <button
            onClick={handleViewAppointments}
            className="viewAppointments-btn"
          >
            View Appoint ments
          </button>
        )}
      </div>
      <Container className="appointment-container">
        {isSubmitted ? (
          <Typography className="success-message">
            Appointment successfully booked! We’ll see you soon.
          </Typography>
        ) : (
          <div>
            <Typography variant="h4" className="title">
              Book Your Appointment
            </Typography>
            {error && (
              <Typography color="error" className="error-message">
                {error}
              </Typography>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    name="date"
                    label="Appointment Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    name="time"
                    label="Appointment Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.time}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                    >
                      {doctorsList.length > 0 ? (
                        doctorsList.map((doctor) => (
                          <MenuItem key={doctor._id} value={doctor._id}>
                            {`${doctor.name} - ${doctor.specialty}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No doctors available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="notes"
                    label="Additional Notes"
                    placeholder="Enter any specific notes for the doctor..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="book-button"
                disabled={!doctorsList.length}
                style={{
                  marginTop: "20px",
                  width: "150px",
                  transform: "translateX(200px)",
                }}
              >
                Book Appointment
              </Button>
            </form>
          </div>
        )}
      </Container>
    </div>
  );
};

export default DoctorAppointment;
