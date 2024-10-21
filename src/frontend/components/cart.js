import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/cart.css";

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(state?.cart || []);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const userData = state?.userData || {};

  const handleBackToMedicine = () => {
    const cartSaved = cart;
    navigate("/medicines", { state: { cartSaved, userData } });
  };

  const handleCheckout = () => {
    const address = userData.address || "your address";
    setDeliveryMessage(
      `Your medicines will be delivered to ${address.street}, ${address.city}, ${address.state} shortly!`
    );
    setCart([]);
  };

  useEffect(() => {
    if (deliveryMessage) {
      const timer = setTimeout(() => {
        navigate("/landing", { state: { userData } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deliveryMessage, navigate, userData]);

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
                <p> Rs {item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
          <h3>Total: Rs {totalPrice}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}
      {deliveryMessage && <p className="delivery-message">{deliveryMessage}</p>}
      <button onClick={handleBackToMedicine}>Back to Medicines</button>
    </div>
  );
};

export default CartPage;
