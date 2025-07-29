import React, { useState, useEffect, useRef } from "react";
import "./styles/OTP.css";
import otpImg from "../../Assets/verify/otp_comp.png";

const OTP = ({
  onOTPChange,
  onClose,
  phoneNumber,
  onResendOTP,
  onVerifyOTP,
}) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const inputRefs = useRef([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only digits
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (errorMessage && newOTP.join("").length <= 6) {
      setErrorMessage("");
    }
  
    if (onOTPChange) onOTPChange(newOTP.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otp.join("");
    if (enteredOTP.length < 6) {
      setErrorMessage("Please enter all 6 digits.");
      return;
    }
    setErrorMessage(""); // clear if okay
    if (onVerifyOTP) onVerifyOTP(enteredOTP);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  useEffect(() => {
    if (otp.join("").length === 6) {
      setErrorMessage(""); // clear when all filled
    }
  }, [otp]);
  

  useEffect(() => {
    if (timeLeft == 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("verify-popup-overlay")) {
      onClose();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="verify-popup-overlay" onClick={handleOverlayClick}>
      <div className="verify-otp-container popup-fade">
        <img src={otpImg} alt="verification" />
        <h4 className="verify-otp-title">Enter Verification Code</h4>
        <p className="verify-otp-instruction">
          Please type the OTP sent to :{" "}
          {phoneNumber && <strong>{phoneNumber}</strong>}
        </p>

        <div className="verify-otp-inputs">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="verify-otp-input"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          ))}
        </div>
        {errorMessage && <p className="otp-error-message">{errorMessage}</p>}
        <p className="verify-otp-timer">
          Didn't receive OTP?{" "}
          {timeLeft > 0 ? (
            <>Resend available in {formatTime(timeLeft)}</>
          ) : (
            <a
              onClick={() => {
                onResendOTP();
                setTimeLeft(60);
              }}
              className="resend-active"
            >
              Resend code?
            </a>
          )}
        </p>

        <div className="verify-otp-footer">
          <button className="back-btn" onClick={onClose}>
            Back
          </button>
          <button className="verify-btn" onClick={handleVerifyOTP}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};
export default OTP;
