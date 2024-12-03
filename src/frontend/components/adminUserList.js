import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/adminUsers.css";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons

const AdminUsers = () => {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [error, setError] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        const userResponse = await axios.get(
          "https://emedical-backend-3ke1.onrender.com/api/users"
        );
        const users = userResponse.data;

        const usersWithIssues = await Promise.all(
          users.map(async (user) => {
            try {
              const issuesResponse = await axios.get(
                `https://emedical-backend-3ke1.onrender.com/api/issues/user/${user._id}`
              );
              const hasNewMessages = issuesResponse.data.some(
                (issue) => !issue.isRead
              );
              return { ...user, messages: issuesResponse.data, hasNewMessages };
            } catch (error) {
              return { ...user, messages: [], hasNewMessages: false };
            }
          })
        );

        setUsersWithMessages(usersWithIssues);
      } catch (error) {
        setError("Failed to load users. Please try again later.");
      }
    };

    fetchUsersAndMessages();
  }, [refreshData]);

  const handleCardClick = async (userId) => {
    setFlippedCards((prev) => ({ ...prev, [userId]: !prev[userId] }));

    if (!flippedCards[userId]) {
      try {
        await axios.patch(
          `https://emedical-backend-3ke1.onrender.com/api/issues/user/${userId}/mark-read`
        );
        setRefreshData((prev) => !prev);
      } catch (error) {}
    }
  };

  const handleReplyClick = (userId) => {
    setActiveUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      await axios.post(
        `https://emedical-backend-3ke1.onrender.com/api/issues/${activeUserId}/messages`,
        {
          sender: "admin",
          message: replyMessage,
        }
      );
      setRefreshData((prev) => !prev);
      handleCloseModal();
    } catch (error) {}
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `https://emedical-backend-3ke1.onrender.com/api/users/${userId}`
        );
        setRefreshData((prev) => !prev);
        alert("User deleted successfully!");
      } catch (error) {
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: "30px", fontSize: "30px" }}>Users List</h2>

      <div className="user-cards-container">
        {usersWithMessages.map((user) => (
          <div
            key={user._id}
            className={`user-card ${flippedCards[user._id] ? "flipped" : ""}`}
            onClick={() => handleCardClick(user._id)}
          >
            {!flippedCards[user._id] ? (
              <div className="card-front">
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
                {user.hasNewMessages && (
                  <span className="notification-badge">New Message</span>
                )}

                <div className="delete-icon">
                  <FaTrash
                    title="Delete User"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card flip
                      handleDeleteUser(user._id);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="card-back">
                <h3>Messages</h3>
                {user.messages && user.messages[0]?.messages?.length > 0 ? (
                  <ul>
                    {user.messages[0].messages.map((message, index) => (
                      <li key={index}>
                        <strong>{message.sender}:</strong> {message.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No messages found.</p>
                )}
                <button
                  className="reply-button"
                  onClick={() => handleReplyClick(user._id)}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Send Reply</h3>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows="5"
              />
              <div className="modal-buttons">
                <button onClick={handleSendReply}>Send</button>
                <button onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
