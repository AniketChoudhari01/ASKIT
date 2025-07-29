import { useNavigate } from "react-router-dom";
import mobileVerifyImg from "../Assets/verify/mobile-auth.png";
import "./signin1.css";
function Email_verification() {
  const navigate = useNavigate();

  return (
    <div className="signin1-container">
      <div className="left mobile-verify">
        <img src={mobileVerifyImg} alt="sign up image" />
      </div>
      <div className="right right-reset right-recover">
        <h1>Account recovery</h1>
        <p>Forgot Your Password?</p>
        <p>
          We've sent a 6-digit OTP to your registered E-mail email@nitpy.ac.in
        </p>
        <label htmlFor="password">Enter OTP</label>
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
            onClick={() => navigate("/account-recovery-email")}
            className="verify-home-button"
          >
            Change mail
          </button>
          <button
            onClick={() => navigate("/reset-password")}
            className="verify-complete-button"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Email_verification;
