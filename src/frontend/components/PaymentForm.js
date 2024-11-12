import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { state } = useLocation();
  const amount = Math.round(state?.totalPrice * 100);
  const userData = state.userData;

  const handlePayment = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { clientSecret },
      } = await axios.post(
        "http://localhost:5000/api/create-payment-intent",
        { amount },
        { headers: { "Content-Type": "application/json" } }
      );

      const cardElement = elements.getElement(CardElement);

      if (!clientSecret || !cardElement) {
        setError("Failed to load payment method.");
        setIsLoading(false);
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userData?.name,
            email: userData?.email,
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setError(null);
        setSuccessMessage(
          `Payment of ${state?.totalPrice} is successful! Redirecting to your dashboard... \n Your order will be delivered to ${userData?.address?.street}, ${userData?.address?.city}`
        );

        setTimeout(() => {
          navigate("/landing", { state: { userData } });
        }, 6000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      {successMessage ? (
        <div
          style={{
            color: "green",
            fontSize: "18px",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {successMessage}
        </div>
      ) : (
        <div>
          <h2>Complete Payment</h2>
          <form onSubmit={handlePayment}>
            <CardElement />
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={!stripe || isLoading}
              style={{ marginTop: "20px" }}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
