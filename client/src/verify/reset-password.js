import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginImg from "../Assets/verify/login-left.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./signin1.css";
function Reset_password() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };
  return (
    <div className="signin1-container">
      <div className="left">
        <img src={loginImg} alt="sign up image" />
      </div>
      <div className="right right-reset">
        <h1 style={{ fontWeight: "300" }}>Update your password</h1>
        <p>Enter a strong new password to secure your ASK IT account.</p>

        <label htmlFor="password">
          Password<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            className="verify-phone-input"
            required
          />
          <span onClick={togglePasswordVisibility} className="form2-eye-icon">
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="confirmPassword">
          Confirm password<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className="verify-phone-input"
            required
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="form2-eye-icon"
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div id="reset-button" className="get-help-update-button-group update-btn">
          <button onClick={() => navigate("/")}>Log in</button>
        </div>
      </div>
    </div>
  );
}

export default Reset_password;
