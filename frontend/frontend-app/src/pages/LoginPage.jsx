import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPassword = localStorage.getItem("savedPassword");
  if (savedEmail) {
    setEmail(savedEmail);
    setRememberMe(true);
  }
  if (savedPassword) setPassword(savedPassword);
}, []);

  const registeredAccounts = [
  { email: "student@iles.com", password: "student123", role: "student", name: "Test Student" },
  { email: "supervisor@iles.com", password: "super123", role: "supervisor", name: "Test Supervisor" },
  { email: "admin@iles.com", password: "admin123", role: "admin", name: "Test Admin" },
];

  const handleLogin = (role) => {
  const newErrors = {};
  if (!email.trim()) newErrors.email = "Email is required";
  if (!password.trim()) newErrors.password = "Password is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Check if account exists
  const account = registeredAccounts.find(
    (acc) => acc.email === email && acc.role === role
  );
  

  if (!account) {
    setErrors({ general: `No ${role} account found with that email` });
    return;
  }

  if (account.password !== password) {
    setErrors({ password: "Incorrect password" });
    return;
  }

  if (rememberMe) {
  localStorage.setItem("role", account.role);
  localStorage.setItem("name", account.name);
  localStorage.setItem("savedEmail", email);
  localStorage.setItem("savedPassword", password);
} else {
  sessionStorage.setItem("role", account.role);
  sessionStorage.setItem("name", account.name);
  localStorage.removeItem("savedEmail");
  localStorage.removeItem("savedPassword");
}
  setErrors({});
  navigate(`/dashboard`);
};

  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome to</h1>
        <h1>ILES</h1>
      </div>

      <div className="login-box">
        <h2>Login</h2>

        {errors.general && (
          <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {errors.general}
          </p>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "", general: "" }));
            }}
            style={{ border: errors.email ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0" }}>
              {errors.email}
            </p>
          )}

          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "", general: "" }));
            }}
            style={{ border: errors.password ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0" }}>
              {errors.password}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
             onChange={(e) => setRememberMe(e.target.checked)}
  />
  <span style={{ color: "white", fontSize: "0.95rem", cursor: "pointer" }}
    onClick={() => setRememberMe(!rememberMe)}
  >
    Remember me
  </span>
  </div>

          <div className="login-buttons">
            <button type="button" onClick={() => handleLogin("student")}>
              Login as Student
            </button>
            <button type="button" onClick={() => handleLogin("supervisor")}>
              Login as Supervisor
            </button>
            <button type="button" onClick={() => handleLogin("admin")}>
              Login as Admin
            </button>
          </div>

          <div className="extra-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <p>
              Don't have an account? <Link to="/create-account">Signup</Link>
            </p>
          </div>
        </form>

        <div className="contact-info">
          <p>Need help? Contact us</p>
          <p>
            Email:{" "}
            <a href="mailto:support.ILES@gmail.com">Support.ILES@gmail.com</a>
          </p>
          <p>
            Phone:{" "}
            <span
              className="phone"
              onClick={() => {
                navigator.clipboard.writeText("+256776083497");
                alert("Phone number copied!");
              }}
            >
              +256 776 083497
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;






{/**
  this is after we have linked backend
  import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error });
        return;
      }

      // Save token and role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      navigate(`/dashboard?role=${data.role}`);
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome to</h1>
        <h1>ILES</h1>
      </div>

      <div className="login-box">
        <h2>Login</h2>

        {errors.general && (
          <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {errors.general}
          </p>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "", general: "" }));
            }}
            style={{ border: errors.email ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0" }}>
              {errors.email}
            </p>
          )}

          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "", general: "" }));
            }}
            style={{ border: errors.password ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0" }}>
              {errors.password}
            </p>
          )}

          <div className="login-buttons">
            <button type="button" onClick={() => handleLogin("student")} disabled={loading}>
              {loading ? "..." : "Login as Student"}
            </button>
            <button type="button" onClick={() => handleLogin("academic")} disabled={loading}>
              {loading ? "..." : "Login as Supervisor"}
            </button>
            <button type="button" onClick={() => handleLogin("admin")} disabled={loading}>
              {loading ? "..." : "Login as Admin"}
            </button>
          </div>

          <div className="extra-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <p>
              Don't have an account? <Link to="/create-account">Signup</Link>
            </p>
          </div>
        </form>

        <div className="contact-info">
          <p>Need help? Contact us</p>
          <p>
            Email:{" "}
            <a href="mailto:support.ILES@gmail.com">Support.ILES@gmail.com</a>
          </p>
          <p>
            Phone:{" "}
            <span
              className="phone"
              onClick={() => {
                navigator.clipboard.writeText("+256776083497");
                alert("Phone number copied!");
              }}
            >
              +256 776 083497
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; */}