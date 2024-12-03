import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/adminBloodDonors.css";

const AdminBloodDonors = () => {
  const [bloodDonors, setBloodDonors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all blood donors from the API
  useEffect(() => {
    const fetchBloodDonors = async () => {
      try {
        const response = await axios.get(
          "https://emedical-backend-3ke1.onrender.com/api/bloodDonors"
        );
        // Only display donors with valid userId data
        const validDonors = response.data.filter(
          (donor) => donor.userId !== null
        );
        setBloodDonors(validDonors);
      } catch (error) {
        console.error("Failed to fetch blood donors:", error);
        setError("Failed to load blood donors. Please try again later.");
      }
    };

    fetchBloodDonors();
  }, []);

  return (
    <div className="blood-donors-container">
      <h2 className="blood-donors-title">All Registered Blood Donors</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="donor-cards-container">
        {bloodDonors.length > 0 ? (
          bloodDonors.map((donor) => (
            <div className="donor-card" key={donor._id}>
              <h3>{donor.userId?.name}</h3>
              <p>
                Blood Group:{" "}
                <span className="blood-group">{donor.bloodGroup}</span>
              </p>
              <p>Phone: {donor.userId?.phoneNumber}</p>
              <p>
                Address: {donor.userId?.address?.city},{" "}
                {donor.userId?.address?.state}
              </p>
              <p>Available: {donor.availabilityStatus ? "Yes" : "No"}</p>
              {donor.lastDonationDate && (
                <p>
                  Last Donation:{" "}
                  {new Date(donor.lastDonationDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No blood donors found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBloodDonors;
