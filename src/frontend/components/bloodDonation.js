import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/bloodDonation.css";
import { useLocation } from "react-router-dom";

const BloodDonation = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const location = useLocation();
  const { userData } = location.state || {};

  console.log(userData);
  useEffect(() => {
    const fetchBloodDonors = async () => {
      try {
        const response = await axios.get(
          "https://emedical-backend.onrender.com/api/bloodDonors"
        );

        // Filter out users with null userId and exclude the current user
        const validUsers = response.data.filter(
          (user) => user.userId !== null && user.userId._id !== userData._id
        );

        setUsers(validUsers);
        setFilteredUsers(validUsers); // Initialize filtered users with all donors
      } catch (error) {
        console.error("Failed to load blood donors:", error);
      }
    };

    fetchBloodDonors();
  }, [userData]);

  console.log(users);

  // Filter users by blood group
  const handleBloodGroupChange = (event) => {
    const bloodGroup = event.target.value;
    setSelectedBloodGroup(bloodGroup);
    setFilteredUsers(
      bloodGroup
        ? users.filter((user) => user.bloodGroup === bloodGroup)
        : users
    );
  };

  // Handle card flip
  const handleRequestClick = (userId) => {
    setFlippedCards((prevFlippedCards) => ({
      ...prevFlippedCards,
      [userId]: !prevFlippedCards[userId],
    }));
  };

  return (
    <div className="blood-donation-container">
      <h2 className="blood-donation-title">Blood Donors</h2>
      <div className="filter-container">
        <label htmlFor="bloodGroup">Filter by Blood Group: </label>
        <select
          id="bloodGroup"
          value={selectedBloodGroup}
          onChange={handleBloodGroupChange}
        >
          <option value="">All</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="donor-cards-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="donor-card" key={user._id}>
              <div
                className={`card-inner ${
                  flippedCards[user._id] ? "flipped" : ""
                }`}
              >
                {/* Front Side */}
                <div className="card-front">
                  <div className="donor-info">
                    <h3>{user.userId?.name}</h3>
                    <p>City: {user.userId?.address?.city}</p>
                    <p>Phone: {user.userId?.phoneNumber}</p>
                  </div>
                  <div className="blood-group-chip">{user.bloodGroup}</div>
                  <button
                    className="request-button"
                    onClick={() => handleRequestClick(user._id)}
                  >
                    Request
                  </button>
                </div>

                <div className="card-back">
                  {console.log("user in BD", user)}
                  <h3 style={{ color: "black" }}>Donor Details</h3>
                  <p style={{ color: "black" }}>Name: {user.userId?.name}</p>
                  <p style={{ color: "black" }}>
                    Phone: {user.userId?.phoneNumber}
                  </p>
                  <p style={{ color: "black" }}>
                    {" "}
                    Street: {user.userId?.address?.street}
                  </p>
                  <p style={{ color: "black" }}>
                    City: {user.userId?.address?.city}
                  </p>
                  <p style={{ color: "black" }}>
                    State: {user.userId?.address?.state}
                  </p>
                  <p className="bgrp">Blood Group: {user.bloodGroup}</p>
                  <button
                    className="request-button"
                    onClick={() => handleRequestClick(user._id)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No donors found for the selected blood group.</p>
        )}
      </div>
    </div>
  );
};

export default BloodDonation;
