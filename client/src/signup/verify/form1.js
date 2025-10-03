import React, { useState } from "react";
import "./styles/verify.css";
import OTP from "./otp"; // Import the OTP component
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
// import checkHash from "../../components/Navbar/Navbar";
const Form1 = ({ onSaveAndContinue }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const { updateUser } = useUser();
  const navigate = useNavigate();

  const isPhoneValid =
    phoneNumber.length === 10 && !phoneNumber.startsWith("0");

  const handleOTPChange = (enteredOTP) => {
    setOTP(enteredOTP);
    if (enteredOTP.length === 6) {
      setShowOTP(false);
      setIsVerified(true);
    }
  };

  const handleSignupAttempt = (action) => {
    setAttemptedSubmit(true);
    if (isPhoneValid) {
      action();
    }
  };

  return (
    <>
      <div className="verify-container">
        <div style={{ width: "30%", height: "90vh" }}>
          <img
            style={{ width: "100%", height: "90vh" }}
            src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="sign up image"
          />
        </div>
        <div className="verify-form">
          <div className="verify-form-group">
            <label className="verify-label">Continue with Mobile Number*</label>
            <div className="verify-mobile-input">
              <select className="verify-country-code">
                <option>+91</option>
              </select>
              <input
                type="text"
                value={phoneNumber}
                placeholder="10 digits mobile number"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits and restrict length to 10
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setPhoneNumber(value);
                    updateUser("phone", value);
                  }
                }}
                className="verify-phone-input"
              />
            </div>

            {/* Error Message */}
            {attemptedSubmit && !isPhoneValid && (
              <p className="verify-label" style={{ color: "red" }}>
                Please enter a valid 10-digit mobile number that does not start
                with 0.
              </p>
            )}

            {/* OTP Modal if needed later */}
            {showOTP && (
              <div className="verify-popup-overlay">
                <OTP
                  phoneNumber={phoneNumber}
                  onOTPChange={handleOTPChange}
                  onClose={() => setShowOTP(false)}
                />
              </div>
            )}
          </div>

          <div className="verify-or-separator">or</div>

          <div className="verify-button-group-ver">
            <button
              className="verify-google-button"
              onClick={() =>
                handleSignupAttempt(() => navigate("/SignUp-google"))
              }
            >
              Sign up with google
            </button>
            <button
              className="verify-email-button"
              onClick={() =>
                handleSignupAttempt(() => {
                  // console.log("Email signup initiated");
                  // handle Email signup here
                })
              }
            >
              Sign up with email
            </button>
          </div>

          <p className="verify-terms">
            By creating an account you agree with our Terms of Service, Privacy
            Policy, and our default Notification Settings.
          </p>

          <p
            className="verify-signin-link"
            onClick={() => {
              const event = new Event("openLoginPopup");
              window.dispatchEvent(event);
              navigate("/#login");
            }}
          >
            Already have an account? Sign In
          </p>

          <div className="verify-button-group-hor">
            <button
              className="verify-home-button"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>

            <button
              className="verify-complete-button"
              onClick={() =>
                handleSignupAttempt(() => navigate("/Consumer-Signup2"))
              }
            >
              Continue Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form1;
