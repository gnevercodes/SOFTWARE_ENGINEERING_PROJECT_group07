const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
  birthDate: { type: Date, required: true },
  specialty: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: Number, required: true },
  clinicAddress: { type: String, required: true },
  // availability: { type: String, required: true },
  bloodDonor: { type: Boolean, default: false },
  emergencyContact: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` field
doctorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
