const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // Reference to the Appointment model
      required: true,
      unique: true, // Ensure one review per appointment
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Rating from 1 to 5 stars
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
