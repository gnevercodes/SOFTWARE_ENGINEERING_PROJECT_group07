// CheckoutConfirmation.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/checkoutConfirmation.css"; // Add CSS for this component

const CheckoutConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cart, userData, totalPrice } = state;

  const handleConfirmOrder = () => {
    alert("Thank you! Your order has been confirmed.");
    navigate("/landing", { state: { userData } });
  };

  return (
    <div className="checkout-confirmation-container">
      <h2>Order Confirmation</h2>
      <p>
        Thank you for shopping with us, {userData.name}. Here is a summary of
        your order.
      </p>
      <div className="order-summary">
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: Rs {item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
        <h3>Total: Rs {totalPrice}</h3>
      </div>
      <button onClick={handleConfirmOrder}>Confirm Order</button>
      <button onClick={() => navigate("/cart", { state: { cart, userData } })}>
        Edit Order
      </button>
    </div>
  );
};

export default CheckoutConfirmation;
