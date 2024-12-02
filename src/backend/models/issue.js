const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // 'user' or 'admin'
      required: true,
      enum: ["user", "admin"],
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp for the message
    },
  },
  { _id: false } // Disable _id for subdocuments
);

const IssueThreadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who raised the issue
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    messages: [MessageSchema], // Array of messages in the thread
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open", // Default status is 'open'
    },
    isRead: {
      type: Boolean,
      default: false, // Tracks if the entire thread has been read
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the created date
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);


const Issue = mongoose.model("IssueThread", IssueThreadSchema);

module.exports = Issue;
