import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/appointment.css";
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
  const location = useLocation();
  const { userData } = location.state || {};
  console.log(userData);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    date: "",
    time: "",
    doctor: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const doctorsList = [
    "Dr. John Doe - Cardiologist",
    "Dr. Sarah Smith - Dermatologist",
    "Dr. Emma Taylor - Neurologist",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked:", formData);
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/landing", { state: { userData } });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  return (
    <Container className="appointment-container">
      {/* <Typography className="title">Book a Doctor Appointment</Typography> */}
      {isSubmitted ? (
        <Typography className="success-message">
          Appointment successfully booked! We’ll see you soon.
        </Typography>
      ) : (
        <div>
          <h1> Book your Appointment</h1>
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
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                  >
                    {doctorsList.map((doctor, index) => (
                      <MenuItem key={index} value={doctor}>
                        {doctor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="book-button"
            >
              Book Appointment
            </Button>
          </form>
        </div>
      )}
    </Container>
  );
};

export default DoctorAppointment;
