const mongoose = require("mongoose");
const bloodDonorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  lastDonationDate: { type: Date },
  availabilityStatus: { type: Boolean, default: true },
});

const BloodDonor = mongoose.model("BloodDonor", bloodDonorSchema);
module.exports = BloodDonor;
