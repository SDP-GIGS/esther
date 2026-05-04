import "./App.css";
import DashboardLayout from "./components/DashboardLayout";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";
import LoginPage from "./pages/LoginPage";

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then(data => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={
        <div>
          <Navbar />
          {role ? (
            <DashboardLayout role={role} />
          ) : (
            <LoginPage />
          )}
        </div>
      } />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;