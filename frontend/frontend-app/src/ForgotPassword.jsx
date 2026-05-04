import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    alert(`Password reset link sent to ${email}`);
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        padding: "40px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
      }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Forgot Password</h2>
        <p style={{ color: "white", marginBottom: "20px" }}>
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              color: "black",
              background: "rgba(255,255,255,0.9)",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "rgb(14, 25, 107)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Send Reset Link
          </button>
          <p style={{ color: "white", marginTop: "16px" }}>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/")}
              style={{ color: "#a78bfa", cursor: "pointer" }}
            >
              Back to Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;