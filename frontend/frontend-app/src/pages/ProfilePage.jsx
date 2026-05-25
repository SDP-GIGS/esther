// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useUser } from "../UserContext";

// ─── Avatar initials helper ────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = name.trim().split(" ");

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return (parts[0]?.[0] || "?").toUpperCase();
}

// ─── Role styling ──────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    label: "Student",
    accent: "#0e196b",
    light: "#3B82F6",
    bg: "linear-gradient(135deg,#0a0f2e,#0d1b4b)",
  },

  academic: {
    label: "Academic Supervisor",
    accent: "#7f1d1d",
    light: "#fca5a5",
    bg: "linear-gradient(135deg,#1a0a0a,#2e1a0f)",
  },

  workplace: {
    label: "Workplace Supervisor",
    accent: "#4a1d7a",
    light: "#a78bfa",
    bg: "linear-gradient(135deg,#0f1a2e,#1a0f2e)",
  },
};

export default function ProfilePage({ onBack, onLogout }) {
  const { user, updateUser, logout } = useUser();

  const { name, email, role } = user;

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  const [section, setSection] = useState("main");

  const [editData, setEditData] = useState({
    name,
    email,
    phone: user.phone || "",
  });

  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState("");

  const [pwData, setPwData] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });

  const [pwErrors, setPwErrors] = useState({});
  const [pwSuccess, setPwSuccess] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ─── Edit Profile ───────────────────────────────────────────────────────
  const handleEditSave = () => {
    const errs = {};

    if (!editData.name.trim()) {
      errs.name = "Name is required";
    }

    if (!editData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      errs.email = "Enter a valid email";
    }

    if (Object.keys(errs).length) {
      setEditErrors(errs);
      return;
    }

    updateUser(editData);

    setEditSuccess("Profile updated successfully!");
    setEditErrors({});

    setTimeout(() => {
      setEditSuccess("");
      setSection("main");
    }, 1500);
  };

  // ─── Change Password ────────────────────────────────────────────────────
  const handlePasswordSave = () => {
    const errs = {};

    if (!pwData.current.trim()) {
      errs.current = "Current password is required";
    }

    if (!pwData.newPw.trim()) {
      errs.newPw = "New password is required";
    } else if (pwData.newPw.length < 8) {
      errs.newPw = "At least 8 characters";
    }

    if (pwData.newPw !== pwData.confirm) {
      errs.confirm = "Passwords do not match";
    }

    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }

    setPwSuccess("Password changed successfully!");
    setPwErrors({});

    setPwData({
      current: "",
      newPw: "",
      confirm: "",
    });

    setTimeout(() => {
      setPwSuccess("");
      setSection("main");
    }, 1500);
  };

  // ─── Logout ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    onLogout();
  };

  // ─── Shared Styles ──────────────────────────────────────────────────────
  const inputStyle = (error) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 8,
    border: `1px solid ${
      error ? "#F87171" : "rgba(255,255,255,0.15)"
    }`,
    background: "rgba(255,255,255,0.07)",
    color: "white",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  });

  const labelStyle = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.8rem",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };

  const renderField = (
    label,
    key,
    state,
    setState,
    errors,
    type = "text"
  ) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>

      <input
        type={type}
        value={state[key]}
        onChange={(e) => {
          setState((prev) => ({
            ...prev,
            [key]: e.target.value,
          }));
        }}
        style={inputStyle(errors[key])}
      />

      {errors[key] && (
        <p
          style={{
            color: "#F87171",
            fontSize: "0.78rem",
            margin: "4px 0 0",
          }}
        >
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

        * {
          box-sizing: border-box;
        }

        .prof-btn {
          transition: all 0.18s;
        }

        .prof-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .menu-item {
          transition: background 0.15s;
          cursor: pointer;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.08) !important;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: config.bg,
          padding: 24,
          fontFamily: "'DM Sans', sans-serif",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>

          {/* Back Button */}
          <button
            onClick={
              section === "main"
                ? onBack
                : () => setSection("main")
            }
            className="prof-btn"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 14,
              padding: "8px 0",
              marginBottom: 24,
            }}
          >
            ← {section === "main"
              ? "Back to Dashboard"
              : "Back to Profile"}
          </button>

          {/* ─── Main Profile ───────────────────────── */}
          {section === "main" && (
            <>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                  padding: "32px 24px",
                  textAlign: "center",
                  marginBottom: 20,
                  borderTop: `4px solid ${config.light}`,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${config.light}, ${config.accent})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 28,
                    fontWeight: 800,
                    fontFamily: "'Syne', sans-serif",
                    boxShadow: `0 0 24px ${config.light}44`,
                  }}
                >
                  {getInitials(name)}
                </div>

                <h2
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {name}
                </h2>

                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    margin: "0 0 4px",
                    fontSize: 14,
                  }}
                >
                  {email}
                </p>

                {/* ROLE LABEL CHANGED HERE */}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    padding: "3px 14px",
                    borderRadius: 20,
                    background: `${config.light}22`,
                    color: config.light,
                    fontSize: 12,
                    fontFamily: "'DM Mono',monospace",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {config.label}
                </span>
              </div>

              {/* Menu */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {[
                  {
                    icon: "✏️",
                    label: "Edit Account",
                    sub: "Update your details",
                    onClick: () => setSection("edit"),
                  },

                  {
                    icon: "🔒",
                    label: "Change Password",
                    sub: "Update your password",
                    onClick: () => setSection("password"),
                  },
                ].map((item, index, arr) => (
                  <div
                    key={item.label}
                    className="menu-item"
                    onClick={item.onClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      borderBottom:
                        index < arr.length - 1
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "none",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>
                      {item.icon}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                        }}
                      >
                        {item.label}
                      </div>

                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {item.sub}
                      </div>
                    </div>

                    <span
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 18,
                      }}
                    >
                      ›
                    </span>
                  </div>
                ))}
              </div>

              {/* Logout */}
              <button
                className="prof-btn"
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "14px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 12,
                  color: "#F87171",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🚪 Log Out
              </button>
            </>
          )}

          {/* ─── Edit Account ─────────────────────── */}
          {section === "edit" && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderTop: `4px solid ${config.light}`,
                borderRadius: 14,
                padding: "28px",
              }}
            >
              <h2
                style={{
                  marginBottom: 24,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                ✏️ Edit Account
              </h2>

              {editSuccess && (
                <div
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid #10B981",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#6EE7B7",
                    marginBottom: 16,
                  }}
                >
                  {editSuccess}
                </div>
              )}

              {renderField(
                "Full Name",
                "name",
                editData,
                setEditData,
                editErrors
              )}

              {renderField(
                "Email Address",
                "email",
                editData,
                setEditData,
                editErrors,
                "email"
              )}

              {renderField(
                "Phone Number",
                "phone",
                editData,
                setEditData,
                editErrors,
                "tel"
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSection("main")}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleEditSave}
                  className="prof-btn"
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 8,
                    border: "none",
                    background: `linear-gradient(135deg,${config.light},${config.accent})`,
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ─── Password Section ─────────────────── */}
          {section === "password" && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderTop: `4px solid ${config.light}`,
                borderRadius: 14,
                padding: "28px",
              }}
            >
              <h2
                style={{
                  marginBottom: 24,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                🔒 Change Password
              </h2>

              {pwSuccess && (
                <div
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid #10B981",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#6EE7B7",
                    marginBottom: 16,
                  }}
                >
                  {pwSuccess}
                </div>
              )}

              {renderField(
                "Current Password",
                "current",
                pwData,
                setPwData,
                pwErrors,
                "password"
              )}

              {renderField(
                "New Password",
                "newPw",
                pwData,
                setPwData,
                pwErrors,
                "password"
              )}

              {renderField(
                "Confirm Password",
                "confirm",
                pwData,
                setPwData,
                pwErrors,
                "password"
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSection("main")}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handlePasswordSave}
                  className="prof-btn"
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 8,
                    border: "none",
                    background: `linear-gradient(135deg,${config.light},${config.accent})`,
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Logout Modal ───────────────────────── */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#0F1724",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "32px 28px",
              width: "100%",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              🚪
            </div>

            <h3
              style={{
                marginBottom: 8,
                color: "white",
              }}
            >
              Log Out?
            </h3>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                marginBottom: 24,
              }}
            >
              You will be redirected to login.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 8,
                  border: "none",
                  background: "#EF4444",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}