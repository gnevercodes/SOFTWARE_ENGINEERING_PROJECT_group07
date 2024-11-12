import Login from "./frontend/components/login.js";
import logo from "./logo.svg";
import MedicalLandingPage from "./frontend/components/landinPage.js";
import CartPage from "./frontend/components/cart.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MedicinePage from "./frontend/components/medicines.js";
import React, { useState } from "react";
import DoctorAppointment from "./frontend/components/userDocAppointment.js";
import RoleSelection from "./frontend/components/roleSelection.js";
import DoctorLandingPage from "./frontend/components/docLandingPage.js";
import DoctorSignup from "./frontend/components/docSignUp.js";
import DoctorLogin from "./frontend/components/docLogin.js";
import Card from "./frontend/components/card.js";
import UserAppointments from "./frontend/components/viewUserAppointments.js";
import DocDoctorAppointments from "./frontend/components/Doctor-appointments.js";
import BloodDonation from "./frontend/components/bloodDonation.js";
import AdminLandingPage from "./frontend/components/adminLanding.js";
import AdminUsers from "./frontend/components/adminUserList.js";
import AdminDoctors from "./frontend/components/adminDoctors.js";
import AdminBloodDonors from "./frontend/components/admonBD.js";
import AdminLogin from "./frontend/components/adminLogin.js";
import CheckoutConfirmation from "./frontend/components/chcekoutConfirmation.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./frontend/components/PaymentForm.js";
const stripePromise = loadStripe(
  "pk_test_51QK38OInmpkINd3bGp6yhx3zU43xMOxwRFF9U3M5N4qHDX2cYVJpaAeEUQ50Xw1nnf2a2HsEEV4GTAOdVqgmHu7A00wQqaOwj9"
);

function App() {
  return (
    // <div className="App">
    //   {/* <Login /> */}
    //   <MedicalLandingPage />
    // </div>

    <Router>
      <Routes>
        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentForm
                // amount
                // userData
                onSuccess={() => alert("Payment Successful!")}
              />
            </Elements>
          }
        />
        {/* <Route path="/" element={<MedicalLandingPage />} /> */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/PatientLanding" element={<MedicalLandingPage />} />
        <Route path="/bloodDonor" element={<BloodDonation />} />
        <Route path="/admin" element={<AdminLandingPage />} />
        <Route path="/admin/userList" element={<AdminUsers />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/bloodDonors" element={<AdminBloodDonors />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route
          path="/checkout-confirmation"
          element={<CheckoutConfirmation />}
        />

        <Route path="/DocLanding" element={<DoctorLandingPage />} />
        <Route path="/DocLogin" element={<DoctorLogin />} />

        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<MedicalLandingPage />} />
        <Route path="/docSignup" element={<DoctorSignup />} />
        <Route path="/card" element={<Card />} />
        <Route path="/medicines" element={<MedicinePage />} />
        <Route path="/userAppointments" element={<UserAppointments />} />
        <Route path="/docDocAppointments" element={<DocDoctorAppointments />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/docAppointment" element={<DoctorAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
