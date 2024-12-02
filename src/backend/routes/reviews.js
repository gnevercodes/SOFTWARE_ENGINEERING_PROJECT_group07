const express = require("express");
const Review = require("../models/reviews");
const Appointment = require("../models/appointments");
const router = express.Router();

// Add a new review
router.post("/api/appointments/:appointmentId/review", async (req, res) => {
  const { appointmentId } = req.params;
  const { review, rating } = req.body;

  try {
    // Validate required fields
    if (!review || !rating) {
      return res.status(400).json({ error: "Review and rating are required." });
    }

    // Ensure the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Check if a review already exists for this appointment
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "A review already exists for this appointment." });
    }

    // Create and save the review
    const newReview = new Review({
      appointmentId,
      review,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully.", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get all reviews for a doctor via appointments
router.get("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find all appointments for the doctor
    const appointments = await Appointment.find({ doctorId }).select("_id");
    const appointmentIds = appointments.map((appt) => appt._id);

    // Find reviews for these appointments
    const reviews = await Review.find({ appointmentId: { $in: appointmentIds } });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get all reviews for a user via appointments
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all appointments for the user
    const appointments = await Appointment.find({ userId }).select("_id");
    const appointmentIds = appointments.map((appt) => appt._id);

    // Find reviews for these appointments
    const reviews = await Review.find({ appointmentId: { $in: appointmentIds } });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a review by appointment ID
router.get("/api/reviews/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const review = await Review.findOne({ appointmentId });
    if (!review) {
      return res.status(404).json({ error: "Review not found for this appointment." });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
