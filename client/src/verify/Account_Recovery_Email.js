import { useState } from "react";
import { useNavigate } from "react-router-dom";
import recoverImg from "../Assets/verify/recover-left.png";
import "./signin1.css";
function Account_Recovery_Email() {
  const navigate = useNavigate();

  return (
    <div className="signin1-container">
      <div className="left">
        <img src={recoverImg} alt="sign up image" />
      </div>
      <div className="right right-reset right-recover">
        <h1>Account recovery</h1>
        <p>Forgot Your Password?</p>

        <label htmlFor="password">Enter your E mail address</label>
        <div className="input-verify input-space">
          <input
            id="password"
            name="password"
            className="verify-phone-input"
            required
          />
        </div>

        <div id="reset-button" className="verify-button-group-hor">
          <button
            onClick={() => navigate("/account-recover-options")}
            className="verify-home-button"
          >
            Get help
          </button>
          <button
            onClick={() => navigate("/email-verification")}
            className="verify-complete-button"
          >
            Send Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account_Recovery_Email;
