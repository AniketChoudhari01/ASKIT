import { useNavigate } from "react-router-dom";
import { useState } from "react";
import almostThereImg from "../Assets/verify/Almost_there.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signin1.css";

function Almost_there() {
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
      <div className="left almost-there-img">
        <img src={almostThereImg} alt="sign up image" />
      </div>
      <div className="right right-reset">
        <h1 style={{ fontWeight: "300" }}>Almost there</h1>
        <p>Just a few more details to create your ASK IT account.</p>
        <label htmlFor="name">
          Name<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input type="text" className="verify-phone-input" id="name" />
        </div>
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

        <div
          id="reset-button"
          className="get-help-update-button-group update-btn"
        >
          <button onClick={() => navigate("/")}>Proceed to home</button>
        </div>
      </div>
    </div>
  );
}

export default Almost_there;
