import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loadingRole, setLoadingRole] = useState(null);
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

  const handleLogin = async (role) => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoadingRole(role);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.detail || "Invalid login credentials" });
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        name: data.user?.first_name || data.user?.email,
        email: data.user?.email,
        role: data.user?.role
      }));
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", role);

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.welcomeText}>
        <h1 style={styles.welcomeTitle}>Welcome to</h1>
        <h1 style={styles.ilesTitle}>ILES</h1>
      </div>

      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Login</h2>

        {errors.general && <p style={styles.errorText}>{errors.general}</p>}

        <form onSubmit={(e) => e.preventDefault()}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "", general: "" }));
            }}
            style={{ ...styles.input, border: errors.email ? "2px solid #f87171" : "1px solid #64748b" }}
          />
          {errors.email && <p style={styles.smallError}>{errors.email}</p>}

          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "", general: "" }));
            }}
            style={{ ...styles.input, border: errors.password ? "2px solid #f87171" : "1px solid #64748b" }}
          />
          {errors.password && <p style={styles.smallError}>{errors.password}</p>}

          <div style={styles.rememberContainer}>
            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <span style={styles.rememberText} onClick={() => setRememberMe(!rememberMe)}>
              Remember me
            </span>
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={() => handleLogin("student")} disabled={loadingRole !== null} style={styles.studentBtn}>
              {loadingRole === "student" ? "Loading..." : "LOGIN AS STUDENT"}
            </button>

            <button type="button" onClick={() => handleLogin("workplace")} disabled={loadingRole !== null} style={styles.workplaceBtn}>
              {loadingRole === "workplace" ? "Loading..." : "LOGIN AS WORKPLACE SUPERVISOR"}
            </button>

            <button type="button" onClick={() => handleLogin("academic")} disabled={loadingRole !== null} style={styles.academicBtn}>
              {loadingRole === "academic" ? "Loading..." : "LOGIN AS ACADEMIC SUPERVISOR"}
            </button>
          </div>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
            <p style={styles.signupText}>
              Don't have an account? <Link to="/create-account" style={styles.link}>Signup</Link>
            </p>
          </div>

          <div style={styles.contactInfo}>
            <p style={styles.contactText}>Need help? Contact us</p>
            <p style={styles.contactText}>
              Email: <a href="mailto:Support.ILES@gmail.com" style={styles.contactLink}>Support.ILES@gmail.com</a>
            </p>
            <p style={styles.contactText}>
              Phone: <span style={styles.phone} onClick={() => { navigator.clipboard.writeText("+256776083497"); alert("Phone copied!"); }}>+256 776 083497</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ====================== STYLES ====================== */
const styles = {
  loginPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0f2e 0%, #1a1f4d 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },

  welcomeText: {
    textAlign: "center",
    marginBottom: "50px",
  },

  welcomeTitle: {
    color: "#ffffff",
    margin: "0 0 8px 0",
    fontSize: "3.2rem",
    fontWeight: "500",
    textShadow: "0 4px 15px rgba(0, 0, 0, 0.8)",
  },

  ilesTitle: {
    color: "#ffffff",
    margin: "0",
    fontSize: "4.8rem",
    fontWeight: "700",
    textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
    letterSpacing: "6px",
  },

  loginBox: {
    background: "rgba(15, 23, 42, 0.97)",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    borderRadius: "20px",
    padding: "50px 60px",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
  },

  heading: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "32px",
    fontSize: "2.1rem",
  },

  label: { color: "#c3d0ff", fontSize: "1.1rem", marginBottom: "8px", display: "block", fontWeight: "500" },
  input: { width: "100%", padding: "14px 16px", marginBottom: "18px", background: "#1e2937", color: "#e0e7ff", borderRadius: "10px", fontSize: "1.05rem" },

  errorText: { color: "#f87171", textAlign: "center", marginBottom: "20px", fontWeight: "500" },
  smallError: { color: "#f87171", fontSize: "0.88rem", margin: "-6px 0 14px 4px" },

  rememberContainer: { display: "flex", alignItems: "center", gap: "10px", margin: "14px 0 26px 0" },
  rememberText: { color: "#c0d0ff", fontSize: "1rem", cursor: "pointer" },

  buttonGroup: { display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" },

  studentBtn: { padding: "16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "white", fontSize: "1.05rem", fontWeight: "600", cursor: "pointer" },
  workplaceBtn: { padding: "16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #059669, #047857)", color: "white", fontSize: "1.05rem", fontWeight: "600", cursor: "pointer" },
  academicBtn: { padding: "16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", fontSize: "1.05rem", fontWeight: "600", cursor: "pointer" },

  extraLinks: { textAlign: "center", marginBottom: "24px" },
  link: { color: "#a5b4fc", textDecoration: "none", fontWeight: "500" },
  signupText: { color: "#c0d0ff", marginTop: "12px" },

  contactInfo: { textAlign: "center", marginTop: "28px", borderTop: "1px solid rgba(148,163,184,0.3)", paddingTop: "24px" },
  contactText: { color: "#b0b8e0", margin: "8px 0", fontSize: "1rem" },
  contactLink: { color: "#a5b4fc" },
  phone: { color: "#a5b4fc", cursor: "pointer", textDecoration: "underline" },
};

export default LoginPage;