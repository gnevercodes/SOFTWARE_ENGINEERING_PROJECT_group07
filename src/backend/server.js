const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

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

// Import the user router
const userRouter = require("./routes/user");
const doctorRouter = require("./routes/doc");
const appointmentRouter = require("./routes/appointments");
const bloodDonorRouter = require("./routes/bloodDonor");
const adminRouter = require("./routes/admin.js");
require("../backend/scheduler.js");

app.use(doctorRouter);
app.use(userRouter);
app.use(appointmentRouter);
app.use(bloodDonorRouter);
app.use(adminRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
