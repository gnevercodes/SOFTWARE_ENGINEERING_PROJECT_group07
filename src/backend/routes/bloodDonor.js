const express = require("express");
const BloodDonor = require("../models/bloodDonor");
const router = express.Router();

// Get all blood donors or filter by blood group
router.get("/api/bloodDonors", async (req, res) => {
  try {
    const { bloodGroup } = req.query; // Optional query parameter
    const filter = bloodGroup ? { bloodGroup } : {};
    const bloodDonors = await BloodDonor.find(filter).populate(
      "userId",
      "name address phoneNumber"
    );
    res.status(200).json(bloodDonors);
  } catch (error) {
    console.error("Error fetching blood donors:", error);
    res.status(500).json({ error: "Failed to fetch blood donors." });
  }
});

// Add a new blood donor
router.post("/api/bloodDonors", async (req, res) => {
  try {
    const { userId, bloodGroup, lastDonationDate, availabilityStatus } =
      req.body;
    const newBloodDonor = new BloodDonor({
      userId,
      bloodGroup,
      lastDonationDate,
      availabilityStatus,
    });
    await newBloodDonor.save();
    res.status(201).json(newBloodDonor);
  } catch (error) {
    console.error("Error adding blood donor:", error);
    res.status(500).json({ error: "Failed to add blood donor." });
  }
});

// Update a blood donor's availability or last donation date
router.put("/api/bloodDonors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { lastDonationDate, availabilityStatus } = req.body;
    const updatedDonor = await BloodDonor.findByIdAndUpdate(
      id,
      { lastDonationDate, availabilityStatus },
      { new: true }
    );
    if (!updatedDonor)
      return res.status(404).json({ error: "Blood donor not found." });
    res.status(200).json(updatedDonor);
  } catch (error) {
    console.error("Error updating blood donor:", error);
    res.status(500).json({ error: "Failed to update blood donor." });
  }
});

module.exports = router;
