import React, { useEffect } from "react";
import "../styling/landingPage.css";
import TestimonialsCarousel from "./carousel";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import appointment from "../assets/appointment.png";
import orderMed from "../assets/order medicines.png";
import docVisit from "../assets/docVisit.png";
import bloodDonate from "../assets/bloodDonate1.png";
import RaiseIssueModal from "./raiseIssue";

const MedicalLandingPage = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  console.log(userData, "from main ");
  const currentHour = new Date().getHours();
  let greeting;

  const loadDoctors = async () => {
    try {
      const response = await axios.get(
        "https://emedical-backend-3ke1.onrender.com/api/doctors"
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to load doctors.");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header userData={userData} />
      <MainContent userData={userData} greeting={greeting} />
      <Footer userData={userData} />
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
                className={activeLink === "services" ? "active" : ""}
                onClick={() => handleLinkClick("services")}
              >
                Services
              </a>
            </li>
            <li>
              <a
                className={activeLink === "testimonials" ? "active" : ""}
                onClick={() => handleLinkClick("testimonials")}
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                className={activeLink === "appointment" ? "active" : ""}
                onClick={() => handleLinkClick("appointment")}
              >
                Make Appointment
              </a>
            </li>
            <li>
              <a
                className={activeLink === "buy-medicine" ? "active" : ""}
                onClick={() => handleLinkClick("buy-medicine")}
              >
                Buy Medicine
              </a>
            </li>
            <li>
              <a
                className={activeLink === "blood-donor" ? "active" : ""}
                onClick={() => handleLinkClick("blood-donor")}
              >
                Blood Donor
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
    if (!userData) {
      navigate(`/login`);
    } else {
      navigate("/medicines", { state: { userData } });
    }
  };

  const handleBookNow = () => {
    if (!userData) {
      navigate(`/login`);
    } else {
      navigate("/docAppointment", { state: { userData } });
    }
  };

  const handleBloodDonorSignup = () => {
    if (!userData) {
      navigate(`/login`);
    } else {
      navigate("/bloodDonor", { state: { userData } });
    }
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
        <h1 style={{ textAlign: "center", fontSize: "2em" }}>Services</h1>
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
        <h1 style={{ textAlign: "center", fontSize: "2em" }}>
          Make an Appointment
        </h1>
        <div
          style={{
            height: "400px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div>
            <button
              className="appointment-button"
              onClick={handleBookNow}
              style={{ width: "200px" }}
            >
              View / Book Appointment
            </button>
          </div>
          <div>
            <img src={appointment} alt="Appointment" />
          </div>
        </div>
      </section>

      <section id="buy-medicine" className="appointment">
        <h1 style={{ textAlign: "center", fontSize: "2em" }}>
          Order Medicines
        </h1>
        <div
          style={{
            height: "400px",
            display: "flex",
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

      <section id="blood-donor" className="appointment">
        <h1 style={{ textAlign: "center", fontSize: "2em" }}>Blood Donation</h1>
        <div
          style={{
            height: "400px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div>
            <img
              style={{ height: "300px" }}
              src={bloodDonate}
              alt="Blood Donation"
            />
          </div>
          <div>
            <button
              className="appointment-button"
              onClick={handleBloodDonorSignup}
            >
              Find a Blood Donor
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const Footer = ({ userData }) => {
  console.log(userData, "from footer");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRaiseIssueModalOpen, setIsRaiseIssueModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [issueText, setIssueText] = useState("");
  const navigate = useNavigate();

  const handleOpenEditModal = () => {
    if (!userData) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }
    setFormData(userData); // Populate form with current user data
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `https://emedical-backend-3ke1.onrender.com/api/users/${userData._id}`,
        formData
      );
      console.log("Updated user:", response.data);
      alert("Profile updated successfully!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleOpenRaiseIssueModal = () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    setIsRaiseIssueModalOpen(true);
  };

  const handleCloseRaiseIssueModal = () => {
    setIsRaiseIssueModalOpen(false);
  };

  const handleSubmitIssue = () => {
    console.log("Raised Issue:", issueText);
    handleCloseRaiseIssueModal();
  };
  console.log(formData);
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: "black",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p>Contact Us: eMed@gmail.com | Phone: xxx-xxx-xxxx</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleOpenEditModal}>Edit Profile</button>
        <button
          style={{ backgroundColor: "red" }}
          onClick={handleOpenRaiseIssueModal}
        >
          Raise an Issue
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="modal-overlay"
          style={{ translate: "transformY(150px)" }}
        >
          <div
            className="modal-content"
            style={{ translate: "transformY(-150px)" }}
          >
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmitEdit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.address?.street || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.address?.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.address?.state || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.address?.zipCode || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, zipCode: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  name="emergency name"
                  placeholder="emergency contact name"
                  value={formData.emergencyContact?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: {
                        ...prev.emergencyContact,
                        name: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  type="text"
                  name="emergency phone"
                  placeholder="emergency contact number"
                  value={formData.emergencyContact?.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: {
                        ...prev.emergencyContact,
                        phoneNumber: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCloseEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRaiseIssueModalOpen && (
        <RaiseIssueModal
          userData={userData}
          onClose={handleCloseRaiseIssueModal}
        />
      )}
    </footer>
  );
};

export default MedicalLandingPage;
