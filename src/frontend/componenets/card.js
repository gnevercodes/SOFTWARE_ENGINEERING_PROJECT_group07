import React from "react";
import "../styling/card.css"; // Import the CSS file
import appointment from "../assets/calendar-user-svgrepo-com.svg";

const Card = ({
  title,
  text,
  linkText,
  linkHref,
  button1Text,
  button2Text,
}) => {
  return (
    <div className="card-container">
      <div className="icon-appointment">
        <img
          src={appointment}
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "5px",
            zIndex: "-1",
          }}
          height="50px"
        />
      </div>
      <div className="card-content">
        <span className="card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            height="46"
            width="65"
          ></svg>
        </span>

        <h5 className="card-title">{title}</h5>

        <p className="card-text">{text}</p>
        <div
          style={{
            marginTop: "30px",
            // display: "flex",
            // justifyContent: "space-between",
            alignItems: "Center",
          }}
        >
          {" "}
          <button className="more-options-btn">{button1Text}</button>
          <button className="accept-btn" type="button">
            {button2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
