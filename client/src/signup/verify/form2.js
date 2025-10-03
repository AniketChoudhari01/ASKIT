import React, { useState } from "react";
import { useNavigate, useContext } from "react-router-dom";
import OTP from "./otp";
import "./styles/verify.css";
import { useUser } from "../../context/UserContext";
import { ArrowLeft } from "lucide-react";
//eye import
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize toast notifications

const Form2 = () => {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const { updateUser, user } = useUser();
  const { phone } = user;
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

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        // console.log("OTP verified successfully:", data);
        toast.success("OTP verified successfully!");
        setIsVerified(true);
        setShowOTP(false);
      } else {
        // console.error("Failed to verify OTP:", data.message);
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      // console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP. Please try again.");
    }
  };

  const handleOTPChange = (enteredOTP) => {
    setOTP(enteredOTP);
    if (enteredOTP.length === 4) {
      verifyOTP(formData.email, enteredOTP);
    }
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        // console.log("OTP sent successfully:", data);
        toast.success("OTP sent successfully!");
        setShowOTP(true);
      } else {
        // console.error("Failed to send OTP:", response.statusText);
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      // console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP. Please try again.");
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
  // console.log("user phone number: ", phone);

  return (
    <>
      <div className="verify-container">
        <div style={{ width: "30%", height: "90vh" }}>
          <img
            style={{ width: "100%", height: "90vh" }}
            src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="sign up image"
          ></img>
        </div>
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
              Join AskIT - Find & Connect Instantly!
            </h2>
            {/* Name and Username */}
            <div className="form2-input-group">
              <div className="form2-input-box">
                <label htmlFor="name" className="form2-label">
                  NAME<span class="required_span">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isVerified}
                  className={
                    isVerified ? "form2-input-disabled" : "form2-input"
                  }
                  required
                />
                {errors.name && (
                  <p className="form2-error required_span">{errors.name}</p>
                )}
              </div>
              <div className="form2-input-box">
                <label htmlFor="username" className="form2-label">
                  USERNAME<span class="required_span">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isVerified}
                  className={
                    isVerified ? "form2-input-disabled" : "form2-input"
                  }
                  required
                />
                {errors.username && (
                  <p className="form2-error required_span">{errors.username}</p>
                )}
              </div>
            </div>
            {/* Email and OTP */}
            <label htmlFor="email" className="form2-label">
              EMAIL<span class="required_span">*</span>
            </label>
            <div className="form2-input-with-button">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="xyz@abc.com"
                onChange={handleChange}
                className={
                  isVerified ? "form2-input-disabled" : "form2-input-email"
                }
                required
              />
              {errors.email && (
                <p className="form2-error required_span">{errors.email}</p>
              )}
              <button
                className={`form2-button ${
                  isVerified ? "form2-button-verified" : ""
                }`}
                onClick={() => {
                  setShowOTP(true);
                  sendOTP(formData.email);
                }}
                disabled={isVerified || !formData.email.trim()}
                style={{
                  opacity: !formData.email.trim() || isVerified ? 0.5 : 1,
                  cursor:
                    !formData.email.trim() || isVerified
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isVerified ? "Verified" : "Verify now"}
              </button>
              {errors.otp && !isVerified && (
                <p className="form2-error required_span">{errors.otp}</p>
              )}
            </div>
            {showOTP && (
              <div className="form2-popup-overlay">
                <OTP
                  onOTPChange={handleOTPChange}
                  onClose={() => setShowOTP(false)}
                />
              </div>
            )}
            {/* Password Fields */}
            <div className="form2-input-group-password">
              <div className="form2-input-box">
                <label htmlFor="password" className="form2-label">
                  PASSWORD<span class="required_span">*</span>
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
                  CONFIRM PASSWORD<span class="required_span">*</span>
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
            <button
              className="form2-button-primary"
              onClick={() => {
                if (validateForm()) {
                  updateUser("name", formData.name);
                  updateUser("username", formData.username);
                  updateUser("email", formData.email);
                  updateUser("password", formData.password);
                  navigate("/profileSetup");
                }
              }}
            >
              Create an account
            </button>
            {/* Sign In Link */}
            <p className="form2-signin" onClick={() => navigate("/Search")}>
              Already have an account? <a href="#">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form2;
