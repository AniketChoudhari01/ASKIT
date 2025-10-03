import { useState } from "react";
import { useNavigate } from "react-router-dom";
import recover_optionsImg from "../Assets/verify/account-recovery-options.png";
import "./signin1.css";
function Account_recovery_options() {
  const navigate = useNavigate();

  return (
    <div className="signin1-container">
      <div className="left">
        <img src={recover_optionsImg} alt="sign up image" />
      </div>
      <div className="right right-reset right-recover">
        <h1>Account recovery</h1>
        <p>Forgot Your Password?</p>
        <p>Using Email</p>
        <p onClick={() => navigate("/account-recovery-email")}>
          Enter your email ID linked to your account. A reset link will be sent
          to your inbox.
        </p>
        <div id="reset-button" className="get-help-update-button-group">
          <button className="get-help-button">Get help</button>
        </div>
      </div>
    </div>
  );
}

export default Account_recovery_options;
