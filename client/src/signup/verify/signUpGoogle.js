import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OTP from "./otp";
import "./styles/verify.css";
import { ArrowLeft } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Form3 = () => {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [tempUser, setTempUser] = useState(null); // State to store temp user data
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const [errors, setErrors] = useState({});

  // Fetch temporary user data on component mount
  useEffect(() => {
    const fetchTempUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/temp-user", {
          credentials: "include", // Include session cookies
        });
        if (response.ok) {
          const data = await response.json();
          setTempUser(data); // Store temp user data
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            username: data.email.split("@")[0] || "", // Default username from email
            email: data.email || "",
          }));
        } else {
          console.error("Failed to fetch temporary user data");
        }
      } catch (error) {
        console.error("Error fetching temporary user data:", error);
      }
    };

    fetchTempUser();
  }, []);

  const handleOTPChange = (enteredOTP) => {
    setOTP(enteredOTP);
    if (enteredOTP.length === 6) {
      setShowOTP(false);
      setIsVerified(true);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/profileSetup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
          credentials: "include", // Include session cookies
        });

        if (response.ok) {
          navigate("/dashboard"); // Redirect to dashboard after successful sign-up
        } else {
          console.error("Failed to create account");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isVerified) {
      newErrors.otp = "Please verify your email";
    } else if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="verify-container">
      <div
        style={{ width: "30%", height: "90vh", background: "#f0f0f0" }}
      ></div>
      <div className="form2_container">
        <button
          onClick={() => navigate("/Consumer-Signup")}
          className="back-button"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="form2-form">
          <h2 className="form2-title">
            Sign Up to <span className="form-title">ASK IT</span>
          </h2>
          <div className="form2-header">
            <p>
              Your Google account {tempUser?.email || "xyz"} will be connected
              to your new ASK IT account
            </p>
            <p>
              Wrong identity?
              <span
                className="start-over-span"
                onClick={() => navigate("/Consumer-signup2")}
              >
                Start over{" "}
              </span>
            </p>
          </div>
          {/* Name and Username */}
          <div className="form2-input-group">
            <div className="form2-input-box">
              <label htmlFor="name" className="form2-label">
                NAME<span className="required_span">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isVerified}
                className={isVerified ? "form2-input-disabled" : "form2-input"}
                required
              />
              {errors.name && (
                <p className="form2-error required_span">{errors.name}</p>
              )}
            </div>
            <div className="form2-input-box">
              <label htmlFor="username" className="form2-label">
                USERNAME<span className="required_span">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isVerified}
                className={isVerified ? "form2-input-disabled" : "form2-input"}
                required
              />
              {errors.username && (
                <p className="form2-error required_span">{errors.username}</p>
              )}
            </div>
          </div>
          {/* Email */}
          <label htmlFor="email" className="form2-label">
            EMAIL<span className="required_span">*</span>
          </label>
          <div className="form2-input-with-button form2-input-with-button-in-google-signup">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={
                isVerified ? "form2-input-disabled" : "form2-input-email"
              }
              required
            />
          </div>
          {/* Password Fields */}
          <div className="form2-input-group-password">
            <div className="form2-input-box">
              <label htmlFor="password" className="form2-label">
                PASSWORD<span className="required_span">*</span>
              </label>
              <div className="form2-password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form2-input"
                  required
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="form2-eye-icon"
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.password && (
                <p className="form2-error required_span">{errors.password}</p>
              )}
            </div>
            <div className="form2-input-box">
              <label htmlFor="confirmPassword" className="form2-label">
                CONFIRM PASSWORD<span className="required_span">*</span>
              </label>
              <div className="form2-password-wrapper">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form2-input"
                  required
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  className="form2-eye-icon"
                >
                  {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="form2-error required_span">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          {/* Terms & Conditions */}
          <div className="form2-checkbox-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
            />
            {errors.agreeToTerms && (
              <p className="form2-error">{errors.agreeToTerms}</p>
            )}

            <label htmlFor="agreeToTerms" className="form2-label">
              I agree with AskIT <a href="#">Terms of Service</a>,{" "}
              <a href="#">Privacy Policy</a> and{" "}
              <a href="#">Notification Settings</a>.
            </label>
          </div>
          {/* Signup Button */}
          <button className="form2-button-primary" onClick={handleSubmit}>
            Create an account
          </button>
          <p className="form2-signin" onClick={() => navigate("/#login")}>
            Already have an account? <a href="">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form3;
