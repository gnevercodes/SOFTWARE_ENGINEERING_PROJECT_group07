const express = require("express");
const nodemailer = require("nodemailer");

const Order = require("../models/orders");
const router = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: "gnevercodes@gmail.com", // Your email
    pass: "hszn dllj zbmy rgkj", // Your email password or app password
  },
});
// Create a new order
router.post("/api/orders", async (req, res) => {
  const {
    userId,
    items,
    totalPrice,
    paymentStatus,
    deliveryAddress,
    userData,
  } = req.body;

  try {
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      paymentStatus,
      deliveryAddress,
    });

    const emailContent = `
      <h1>Payment Confirmation</h1>
      <p>Dear ${userData?.name},</p>
      <p>Your payment of <strong>Rs${totalPrice}</strong> was successful.</p>
      <p>Order Details:</p>
      <ul>
        ${items
          .map((item) => `<li>${item.name} - Quantity: ${item.quantity}</li>`)
          .join("")}
      </ul>
      <p>Your order will be delivered to:</p>
      <p>${deliveryAddress?.street}, ${deliveryAddress?.city}, ${
      deliveryAddress?.state
    }, ${deliveryAddress?.zipCode}</p>
    `;

    await transporter.sendMail({
      from: "gnevercodes@gmail.com",
      to: userData?.email,
      subject: "Payment Confirmation",
      html: emailContent,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});
// Get orders by user ID
router.get("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

module.exports = router;
