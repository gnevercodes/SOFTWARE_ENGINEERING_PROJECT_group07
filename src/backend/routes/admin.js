// backend/routes/adminRoutes.js
const express = require("express");
const Appointment = require("../models/appointments");
const Doctor = require("../models/doc");
const User = require("../models/user");
const BloodDonor = require("../models/bloodDonor");

const router = express.Router();

// GET /api/admin/metrics
// Fetch total counts for doctors, patients, appointments, blood donors, and appointment statuses
router.get("/api/admin/metrics", async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalBloodDonors = await BloodDonor.countDocuments();

    const scheduledAppointments = await Appointment.countDocuments({
      status: "Scheduled",
    });
    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      status: "Cancelled",
    });

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalBloodDonors,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ message: "Error fetching metrics data." });
  }
});

module.exports = router;
