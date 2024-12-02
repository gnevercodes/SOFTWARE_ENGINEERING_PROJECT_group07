const express = require("express");
const IssueThread = require("../models/issue");
const router = express.Router();

router.post("/api/issues", async (req, res) => {
  try {
    const { user, email, message } = req.body;

    if (!user || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if an issue thread already exists for the user
    let issueThread = await IssueThread.findOne({ user });

    if (issueThread) {
      // If an issue thread exists, add the new message
      issueThread.messages.push({ sender: "user", message });
      issueThread.isRead = false; // Mark the thread as unread
      issueThread.updatedAt = new Date();

      await issueThread.save();
      return res.status(200).json({
        message: "Message added to existing issue thread",
        issueThread,
      });
    }

    // Create a new issue thread if none exists
    issueThread = new IssueThread({
      user,
      email,
      messages: [{ sender: "user", message }],
      isRead: false,
    });

    await issueThread.save();
    res
      .status(201)
      .json({ message: "Issue thread created successfully", issueThread });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});


router.patch("/api/issues/user/:userId/mark-read", async (req, res) => {
  const { userId } = req.params;

  try {
    const issue = await IssueThread.findOne({ user: userId });
    if (!issue) {
      return res.status(404).json({ error: "Issue thread not found" });
    }

    issue.isRead = true; // Mark the thread as read
    issue.updatedAt = new Date();

    await issue.save();

    res.status(200).json({ message: "Issue marked as read", issue });
  } catch (error) {
    console.error("Error marking issue as read:", error);
    res.status(500).json({ error: "Failed to mark issue as read" });
  }
});


router.post("/api/issues/:userId/messages", async (req, res) => {
  const { userId } = req.params;
  const { sender, message } = req.body;

  try {
    if (!message || !sender) {
      return res
        .status(400)
        .json({ error: "Sender and message are required." });
    }

    const issueThread = await IssueThread.findOne({ user: userId });
    if (!issueThread) {
      return res.status(404).json({ error: "Issue thread not found for the user." });
    }

    issueThread.messages.push({ sender, message, timestamp: new Date() });

    if (sender === "admin") {
      issueThread.isRead = true; // Mark the thread as read if admin replies
    }

    issueThread.updatedAt = new Date();
    await issueThread.save();

    res.status(200).json({
      message: "Reply added successfully.",
      updatedIssueThread: issueThread,
    });
  } catch (error) {
    console.error("Error adding reply to issue thread:", error);
    res.status(500).json({ error: "Failed to add reply to issue thread." });
  }
});

router.get("/api/issues", async (req, res) => {
  try {
    const issues = await IssueThread.find().populate("user", "name email");
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const issueThread = await IssueThread.findById(id).populate(
      "user",
      "name email"
    );

    if (!issueThread) {
      return res.status(404).json({ error: "Issue thread not found" });
    }

    res.status(200).json(issueThread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/api/issues/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const issues = await IssueThread.find({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!issues || issues.length === 0) {
      return res.status(404).json({ error: "No issues found for this user" });
    }

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues by user ID:", error.message);
    res.status(500).json({ error: error.message });
  }
});
router.patch("/api/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const issueThread = await IssueThread.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!issueThread) {
      return res.status(404).json({ error: "Issue thread not found" });
    }

    res
      .status(200)
      .json({ message: "Status updated successfully", issueThread });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
