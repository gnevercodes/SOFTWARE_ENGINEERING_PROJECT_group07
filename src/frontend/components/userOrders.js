import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styling/userOrders.css"; // Add this import for your CSS

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { userData } = location.state || {};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://emedical-backend-3ke1.onrender.com/api/orders/${userData._id}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, [userData._id]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="user-orders-title">Your Orders</h2>
      <div className="user-orders-container">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-detail">Total Price: ${order.totalPrice}</div>
            <div
              className={`order-status ${order.paymentStatus.toLowerCase()}`}
            >
              Status: {order.paymentStatus}
            </div>
            <div className="delivery-address">
              Address:{" "}
              {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}
            </div>
            <div className="order-items">
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li className="order-item" key={index}>
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} x ${item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
