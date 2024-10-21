import React from "react";
import "../styling/landingPage.css";
import TestimonialsCarousel from "./carousel";
import Login from "./login";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import appointment from "../assets/appointment.png";
import orderMed from "../assets/order medicines.png";
import docVisit from "../assets/docVisit.png";

const MedicalLandingPage = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header userData={userData} />
      <MainContent userData={userData} greeting={greeting} />
      <Footer />
    </div>
  );
};

const Header = ({ userData }) => {
  const [activeLink, setActiveLink] = useState("services");
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleNavigation = () => {
    navigate("/login");
  };

  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1>eMed</h1>
      </div>
      <div>
        <nav>
          <ul className="nav-links">
            <li>
              <a
                // href="#services"
                className={activeLink === "services" ? "active" : ""}
                onClick={() => handleLinkClick("services")}
              >
                Services
              </a>
            </li>
            <li>
              <a
                // href="#testimonials"
                className={activeLink === "testimonials" ? "active" : ""}
                onClick={() => handleLinkClick("testimonials")}
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                // href="#appointment"
                className={activeLink === "appointment" ? "active" : ""}
                onClick={() => handleLinkClick("appointment")}
              >
                Make Appointment
              </a>
            </li>
            <li>
              <a
                // href="#buy-medicine"
                className={activeLink === "buy-medicine" ? "active" : ""}
                onClick={() => handleLinkClick("buy-medicine")}
              >
                Buy Medicine
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <button onClick={handleNavigation} className="loginBut">
          {userData?.name ? "Logout" : "Login/Register"}
        </button>
      </div>
    </header>
  );
};

const MainContent = ({ userData, greeting }) => {
  const navigate = useNavigate();

  const handleBuyNowButton = () => {
    navigate("/medicines", { state: { userData } });
  };

  const handleBookNow = () => {
    navigate("/docAppointment", { state: { userData } });
  };

  return (
    <main>
      <section className="hero" style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            gap: "50px",
            marginLeft: "100px",
          }}
        >
          <div>
            <h2>
              {greeting}, {userData?.name}
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <h2>Your Health, Our Priority</h2>
            <p>Connecting you to the best healthcare services online.</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <img src={docVisit} alt="Doctor Visit" />
        </div>
      </section>
      <section id="services" className="services">
        <h1
          style={{ display: "flex", justifyContent: "center", fontSize: "2em" }}
        >
          Services
        </h1>
        <div className="service-list">
          <div className="service-item">
            <h3>Online Consultations</h3>
            <p>Consult with top doctors from the comfort of your home.</p>
          </div>
          <div className="service-item">
            <h3>Prescription Medicines</h3>
            <p>Order your prescribed medicines with easy home delivery.</p>
          </div>
          <div className="service-item">
            <h3>Health Tracking</h3>
            <p>Track your health and medication adherence effortlessly.</p>
          </div>
        </div>
      </section>
      <section id="testimonials">
        <TestimonialsCarousel userData={userData} />
      </section>

      <section id="appointment" className="appointment">
        <h1
          style={{ display: "flex", justifyContent: "center", fontSize: "2em" }}
        >
          Make an Appointment
        </h1>
        <div
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div>
            <button className="appointment-button" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
          <div>
            <img src={appointment} alt="Appointment" />
          </div>
        </div>
      </section>

      <section id="buy-medicine" className="appointment">
        <h1
          style={{ display: "flex", justifyContent: "center", fontSize: "2em" }}
        >
          Order Medicines
        </h1>
        <div
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div>
            <img
              style={{ height: "300px" }}
              src={orderMed}
              alt="Order Medicines"
            />
          </div>
          <div>
            <button className="appointment-button" onClick={handleBuyNowButton}>
              Order Medicines
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p>Contact Us: eMed@gmail.com | Phone: xxx-xxx-xxxx</p>
    </footer>
  );
};

export default MedicalLandingPage;
