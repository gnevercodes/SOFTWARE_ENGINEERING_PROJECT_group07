const cron = require("node-cron");
const Appointment = require("../backend/models/appointments");
const mongoose = require("mongoose");

// Function to update appointment status
const updateAppointmentStatus = async () => {
  const currentDate = new Date();

  try {
    // Find appointments to be updated
    const appointmentsToUpdate = await Appointment.find({
      date: { $lt: currentDate },
      status: "Scheduled",
    });
    console.log("Appointments to update:", appointmentsToUpdate);

    // Update the status of past appointments
    const updatedAppointments = await Appointment.updateMany(
      { date: { $lt: currentDate }, status: "Scheduled" },
      { $set: { status: "Completed" } }
    );

    console.log(
      `Updated ${updatedAppointments.modifiedCount} appointments to 'Completed'`
    );
  } catch (error) {
    console.error("Error updating appointment statuses:", error);
  }
};

// Schedule the job to run daily at midnight
cron.schedule("0 0 * * *", updateAppointmentStatus);

module.exports = updateAppointmentStatus;
