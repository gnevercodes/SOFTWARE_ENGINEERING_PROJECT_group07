import React, { useState, useEffect } from "react";
import "../styling/raiseIssue.css";
import axios from "axios";

const RaiseIssueModal = ({ userData, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMessages, setViewMessages] = useState(false);
  const [issueMessage, setIssueMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://emedical-backend-3ke1.onrender.com/api/issues/user/${userData._id}`
        );
        setMessages(response.data[0]?.messages || []);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
        } else {
          setError("Failed to fetch messages. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    console.log(messages);
  }, [userData, issueMessage]);

  const handleSubmit = async () => {
    if (!issueMessage.trim()) {
      setError("Please enter a message.");
      return;
    }

    try {
      const response = await axios.post(
        "https://emedical-backend-3ke1.onrender.com/api/issues",
        {
          user: userData._id,
          email: userData.email,
          message: issueMessage,
        }
      );
      if (response.status === 201 || response.status === 200) {
        setSuccess("Issue raised successfully.");
        setNewMessage(true);
        setError("");
        setIssueMessage("");
      }
    } catch (error) {
      setError("Failed to raise issue. Please try again.");
      setSuccess("");
    }
  };

  const handleToggleView = () => {
    setViewMessages((prev) => !prev);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {viewMessages ? (
          <>
            <h2>View Messages</h2>
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className="message-card">
                    <p style={{ color: "black" }}>
                      <strong>{message.sender}: </strong> {message.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No messages found.</p>
            )}
            <button onClick={handleToggleView} className="back-button">
              Back to Raise an Issue
            </button>
          </>
        ) : (
          <>
            <h2>Raise an Issue</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <textarea
              placeholder="Describe your issue..."
              value={issueMessage}
              onChange={(e) => setIssueMessage(e.target.value)}
              className="issue-textarea"
            />
            <div className="modal-actions">
              <button
                onClick={handleSubmit}
                className="submit-button"
                style={{
                  height: "40px",
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Submit
              </button>
              <button
                onClick={onClose}
                className="cancel-button"
                style={{
                  height: "40px",
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Close
              </button>
              <button
                onClick={handleToggleView}
                className="view-messages-button"
                style={{
                  height: "40px",
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                View Messages
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RaiseIssueModal;
