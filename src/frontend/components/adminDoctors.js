import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/adminDoctors.css"; // Assuming you have a CSS file for styling
import { FaTrash } from "react-icons/fa"; // Importing trash icon from react-icons

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://emedical-backend-3ke1.onrender.com"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setError("Failed to load doctors. Please try again later.");
      }
    };

    fetchDoctors();
  }, []);

  // Handle delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://emedical-backend-3ke1.onrender.com/api/doctors/${doctorId}`
      );
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor._id !== doctorId)
      );
      alert("Doctor deleted successfully.");
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      alert("Failed to delete doctor. Please try again.");
    }
  };

  return (
    <div className="admin-doctors-container">
      <h2 className="admin-doctors-title">All Registered Doctors</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="doctor-cards-container">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <h3>{doctor.name}</h3>
              <p>Email: {doctor.email}</p>
              <p>Specialty: {doctor.specialty || "N/A"}</p>
              <p>Phone: {doctor.phoneNumber}</p>
              <p>Clinic Address: {doctor.clinicAddress}</p>
              <p>Experience: {doctor.experience} years</p>
              <div
                className="delete-button"
                onClick={() => handleDeleteDoctor(doctor._id)}
              >
                <FaTrash />
              </div>
            </div>
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;
