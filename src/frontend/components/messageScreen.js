// MessageScreen.js
import React from "react";
import { motion } from "framer-motion";
import "../styling/messageScreen.css"; // Custom styles

const MessageScreen = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <motion.h2
        initial={{ x: "-100vw" }} // Start from off the left side of the screen
        animate={{ x: "0vw" }} // Move to the center
        exit={{ x: "200%" }} // Exit to the right
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.5,
        }}
        style={{
          fontSize: "2.5rem",
          color: "green",
          //   color: "#ffffff",
          //   backgroundColor: "#1976d2",
          //   padding: "20px",
          //   borderRadius: "10px",
          //   boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        }}
      >
        {message}
      </motion.h2>
    </div>
  );
};

export default MessageScreen;
