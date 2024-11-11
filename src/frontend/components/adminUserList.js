import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/adminUsers.css"; // Add your CSS file for styling

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to load users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <h2 className="admin-users-title">All Registered Users</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="user-cards-container">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user-card" key={user._id}>
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phoneNumber}</p>
              <p>
                Address: {user.address?.city}, {user.address?.state}
              </p>
              <p>Blood Group: {user.bloodGroup || "N/A"}</p>
              <p>
                Emergency Contact: {user.emergencyContact?.name} -{" "}
                {user.emergencyContact?.phoneNumber}
              </p>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
