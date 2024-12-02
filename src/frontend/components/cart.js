// Updated CartPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/cart.css";

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(state?.cart || []);
  const userData = state?.userData || {};

  const handleBackToMedicine = () => {
    const cartSaved = cart;
    navigate("/medicines", { state: { cartSaved, userData } });
  };

  const handleCheckout = () => {
    const totalPrice = cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
    navigate("/payment", {
      state: { cart, userData, totalPrice },
    });
    setCart([])
  };

  const totalPrice = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li className="card-li" key={item.id}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Rs {item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
          <h3>Total: Rs {totalPrice}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}
      <button onClick={handleBackToMedicine} className="cart-button">
        Back to Medicines
      </button>
    </div>
  );
};

export default CartPage;
