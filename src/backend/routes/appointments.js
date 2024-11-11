const express = require("express");
const Appointment = require("../models/appointments");
const Doctor = require("../models/doc");
const User = require("../models/user");

const router = express.Router();

router.post("/api/appointments", async (req, res) => {
  try {
    const { patientId, doctorId, date, time, notes } = req.body;

    // Check if the user (patient) exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      notes,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment successfully created",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});
router.get("/api/appointments/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find appointments based on the user ID
    const appointments = await Appointment.find({ patientId: userId }).populate(
      "doctorId",
      "name specialty"
    );

    if (!appointments.length) {
      return res
        .status(404)
        .json({ error: "No appointments found for this user." });
    }

    // Send appointment details including doctor name and specialty
    res.json(
      appointments.map((appointment) => ({
        _id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes,
        doctorName: appointment.doctorId.name,
        doctorSpecialty: appointment.doctorId.specialty,
        status: appointment.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments." });
  }
});

router.get("/api/appointments/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find appointments based on the doctor ID
    const appointments = await Appointment.find({ doctorId }).populate(
      "patientId",
      "name email"
    );

    if (!appointments.length) {
      return res
        .status(404)
        .json({ error: "No appointments found for this doctor." });
    }

    // Send appointment details including patient name and email
    res.json(
      appointments.map((appointment) => ({
        _id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes,
        patientName: appointment.patientId.name,
        patientEmail: appointment.patientId.email,
        status: appointment.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments." });
  }
});

router.put("/api/appointments/:appointmentId/cancel", async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes } = req.body;

  try {
    // Check if the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Update the status and notes
    appointment.status = status || "Cancelled"; // Default to "Cancelled"
    if (notes) {
      appointment.notes = notes;
    }

    // Save the updated appointment
    await appointment.save();

    res.json({
      message: "Appointment updated successfully.",
      appointment: {
        _id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes,
      },
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment." });
  }
});

module.exports = router;
