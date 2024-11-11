const express = require("express");
const bcrypt = require("bcrypt");
const Doctor = require("../models/doc");

const router = express.Router();

// Doctor Signup API
router.post("/api/doctor/signup", async (req, res) => {
  console.log(req, "from frontend");
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      birthDate,
      specialty,
      licenseNumber,
      qualifications,
      experience,
      clinicAddress,
      // availability,
      bloodDonor,
      emergencyName,
      emergencyPhone,
    } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Doctor
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      birthDate,
      specialty,
      licenseNumber,
      qualifications,
      experience,
      clinicAddress,
      // availability,
      bloodDonor,
      emergencyContact: {
        name: emergencyName,
        phoneNumber: emergencyPhone,
      },
    });
    console.log(newDoctor, "newDoc");
    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    console.error("Doctor Signup Error:", error);
    res.status(500).json({ error: "Doctor signup failed." });
  }
});

// Doctor Login API
router.post("/api/doctorLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // If successful, respond with doctor information
    res.json({
      message: "Login successful",
      doctor: {
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
      },
    });
  } catch (error) {
    console.error("Doctor Login Error:", error);
    res.status(500).json({ error: "Login failed." });
  }
});

router.post("/api/doctor/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful", doctor });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error retrieving doctors:", error);
    res.status(500).json({ error: "Failed to retrieve doctors." });
  }
});

module.exports = router;
