const express = require("express");
const User = require("../models/user");
const router = express.Router();
const BloodDonor = require("../models/bloodDonor");

// Signup Route
router.post("/api/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password, // Plaintext password
      phone: phoneNumber,
      birthDate: dateOfBirth,
      bloodGroup,
      street,
      city,
      state,
      zipCode,
      emergencyName,
      emergencyPhone,
      isDonor, // Added field
    } = req.body;

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Save password as plaintext
      phoneNumber,
      dateOfBirth,
      bloodGroup,
      address: {
        street,
        city,
        state,
        zipCode,
      },
      emergencyContact: {
        name: emergencyName,
        phoneNumber: emergencyPhone,
      },
      isDonor,
    });

    await newUser.save();

    // If the user opts to be a blood donor
    if (isDonor) {
      const newDonor = new BloodDonor({
        userId: newUser._id,
        bloodGroup: newUser.bloodGroup,
      });
      await newDonor.save();
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed." });
  }
});

// Login Route
router.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    console.log("Attempting login for email:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check password (no hashing, directly compare plaintext passwords)
    if (password !== user.password) {
      console.log("Password incorrect");
      return res.status(400).json({ error: "Incorrect Password" });
    }

    // If successful, respond with user information
    res.json({
      message: "Login successful",
      user: { user },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed." });
  }
});
router.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // If the user is a blood donor, delete the corresponding blood donor entry
    if (user.isDonor) {
      await BloodDonor.findOneAndDelete({ userId: user._id });
    }

    res.json({
      message: "User deleted successfully.",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// Edit User Route
router.patch("/api/users/:userId", async (req, res) => {
  console.log(req.body.emergencyContact);
  const { userId } = req.params; // Extract the user ID from the route parameter
  const {
    name,
    email,
    phoneNumber,
    dateOfBirth,
    bloodGroup,
    address, // Full address object
    emergencyContact,
    isDonor,
  } = req.body;
  console.log(emergencyContact);
  try {
    // Find the user and update fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phoneNumber,
        dateOfBirth,
        bloodGroup,
        address: {
          street: address?.street,
          city: address?.city,
          state: address?.state,
          zipCode: address?.zipCode,
        },
        emergencyContact: {
          name: emergencyContact?.name,
          phoneNumber: emergencyContact?.phoneNumber,
        },
        isDonor,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// Fetch All Users Route
router.get("/api/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

module.exports = router;
