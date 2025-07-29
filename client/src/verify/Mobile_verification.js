import { useNavigate } from "react-router-dom";
import mobileVerifyImg from "../Assets/verify/mobile-auth.png";
import "./signin1.css";
function Mobile_verification() {
  const navigate = useNavigate();

  return (
    <div className="signin1-container">
      <div className="left mobile-verify">
        <img src={mobileVerifyImg} alt="sign up image" />
      </div>
      <div className="right right-reset right-recover">
        <h1>Account recovery</h1>
        <p>Forgot Your Password?</p>
        <p>We've sent a 6-digit OTP to your registered mobile +918010214443</p>
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
            onClick={() => navigate("/account-recovery")}
            className="verify-home-button"
          >
            Change number
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

export default Mobile_verification;
