const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://gnevercodes:seproject@softwareengineeringdb.xli4x.mongodb.net/mydatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Event listeners for MongoDB connection
mongoose.connection.on("connected", () =>
  console.log("Mongoose is connected.")
);
mongoose.connection.on("error", (err) => console.error("Mongoose error:", err));
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected.")
);

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  emergencyContact: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` before save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone: phoneNumber,
      birthDate: dateOfBirth,
      bloodGroup,
      street,
      city,
      state,
      zipCode,
      emergencyName,
      emergencyPhone,
    } = req.body;

    // Create new user
    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
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
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Attempting login for email:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password incorrect");
      return res.status(400).json({ error: "Invalid email or password." });
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

// Export the app for testing purposes
module.exports = app;

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
