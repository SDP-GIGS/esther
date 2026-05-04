import React, { useState } from "react";

function CreateAccount({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    otherNames: "",
    email: "",
    course: "",
    university: "",
    phone: "",
    yearOfStudy: "",
    internshipPlace: "",
    supervisor: "",
  });

  const [step, setStep] = useState("form");
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const requiredFields = {
    firstName: "First Name",
    surname: "Surname",
    email: "Email",
    course: "Course",
    university: "University",
    phone: "Phone Number",
    yearOfStudy: "Year of Study",
    internshipPlace: "Internship Place",
    supervisor: "Supervisor",
  };

  const newErrors = {};
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!formData[field].trim()) {
      newErrors[field] = `${label} is required`;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  setStep("verify");
};

  const sendVerification = (method) => {
    setVerifyMethod(method);
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(generated);
    alert(`Verification code sent to ${formData[method]}: ${generated}`);
  };

  const checkCode = () => {
    if (code === sentCode) {
      setStep("success");
    } else {
      alert("Incorrect code, try again.");
    }
  };

  if (step === "form") {
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
          maxWidth: "500px",
        }}>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "24px" }}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              { label: "First Name", name: "firstName" },
              { label: "Surname", name: "surname" },
              { label: "Other Names", name: "otherNames" },
              { label: "Email", name: "email" },
              { label: "Course", name: "course" },
              { label: "University", name: "university" },
              { label: "Phone Number", name: "phone" },
              { label: "Year of Study", name: "yearOfStudy" },
              { label: "Internship Place", name: "internshipPlace" },
              { label: "Supervisor", name: "supervisor" },
            ].map(({ label, name }) => (
              <div key={name} style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                gap: "12px",
              }}>
                <label style={{
                  color: "white",
                  width: "140px",
                  minWidth: "140px",
                  textAlign: "right",
                  fontSize: "1rem",
                }}>
                  {label}:
                </label>
                <input
                  name={name}
                  onChange={(e) => {
                    handleChange(e);
                    setErrors(prev => ({ ...prev, [name]: "" }));
      }}
                  required={name !== "otherNames"}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    background: "rgba(255,255,255,0.9)",
                    color: "black",
                  }}
                />
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 40px",
                  background: "rgb(14, 25, 107)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start",paddingTop: "40px", paddingLeft: "40px", }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "10px", textAlign: "center" }}>
          <h2 style={{ color: "white" }}>Verify Account</h2>
          <p style={{ color: "white", marginBottom: "20px" }}>Choose verification method:</p>
          <button onClick={() => sendVerification("email")} style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}>
            Verify by Email
          </button>
          <button onClick={() => sendVerification("phone")} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Verify by Phone
          </button>

          {verifyMethod && (
            <div style={{ marginTop: "20px" }}>
              <input
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ padding: "10px", borderRadius: "4px", marginRight: "10px" }}
              />
              <button onClick={checkCode} style={{ padding: "10px 20px", cursor: "pointer" }}>
                Submit Code
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start",paddingTop: "40px", paddingLeft: "40px", }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "white" }}>Signup Successful!</h2>
          <button onClick={onSignupSuccess} style={{ padding: "10px 30px", marginTop: "20px", cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default CreateAccount;