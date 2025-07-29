import signupImg from "../Assets/verify/signup-left.png";
import { MdCheckCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./signin1.css";
import { toast } from "react-toastify";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import OTP from "../signup/verify/otp";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
function Signin1() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const verifyOTP = async (mobile, otp) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, otp }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log("OTP verified successfully:", data);
        toast.success("OTP verified successfully!");
        setIsMobileVerified(true);
        setShowOTP(false);
        setUser((prev) => ({
          ...prev,
          mobile: mobile,
        }));
      } else {
        console.error("Failed to verify OTP:", data.message);
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP. Please try again.");
    }
  };

  const handleOTPChange = (enteredOTP) => {
    setOTP(enteredOTP);
    if (enteredOTP.length === 6) {
      verifyOTP(formData.mobile, enteredOTP); // <- use mobile
    }
  };

  const sendOTP = async (mobile) => {
    try {
      // console.log("SERVER_URL:", process.env.REACT_APP_SERVER_URL); // check this

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: mobile }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log("OTP sent successfully:", data);
        toast.success("OTP sent successfully!");
        setShowOTP(true);
      } else {
        console.error("Failed to send OTP:", response.statusText);
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
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
  return (
    <div className="signin1-container">
      <div className="left">
        <img src={signupImg} alt="sign up image" />
      </div>
      <div className="right">
        <h1>Sign in</h1>
        <p>
          Join a community built on trust, talent, and connection. Sign up to
          find or offer services with ease.
        </p>
        <label htmlFor="mobile">
          Continue with mobile number <span>*</span>
        </label>

        <div className="input-verify input-verify-width">
          <input
            type="text"
            value={formData.mobile}
            name="mobile"
            placeholder="10 digits mobile number"
            onChange={handleChange}
            className="verify-phone-input"
            disabled={isMobileVerified}
          />

          <button
            id="verify-img"
            onClick={() => {
              setShowOTP(true);
              sendOTP(formData.mobile); // <- use mobile
            }}
            disabled={isMobileVerified || !formData.mobile.trim()}
            style={{
              opacity: !formData.mobile.trim() || isMobileVerified ? 0.5 : 1,
              cursor:
                !formData.mobile.trim() || isMobileVerified
                  ? "not-allowed"
                  : "pointer",
            }}
            title="Enter a valid mobile number to verify."
          >
            <MdCheckCircle
            className="btn-icon"
              // style={{
              //   background: "black",
              //   color: "#00ff00",
              //   fontSize: "24px",
              //   marginRight: "8px",
              //   borderRadius: "3rem",
              // }}
            />
            Verify now
          </button>
        </div>
        {showOTP && (
          <div className="form2-popup-overlay">
            <OTP
              phoneNumber={formData.mobile}
              onOTPChange={handleOTPChange}
              onClose={() => setShowOTP(false)}
            />
          </div>
        )}

        <div className="verify-or-separator">or</div>
        <a
          href={`${process.env.REACT_APP_SERVER_URL}/google`}
          className="login-google-btn"
        >
          <svg style={{ height: "20px", width: "20px" }} viewBox="0 0 40 40">
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#FFC107"
            />
            <path
              d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
              fill="#FF3D00"
            />
            <path
              d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
              fill="#4CAF50"
            />
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#1976D2"
            />
          </svg>
          Sign up with Google
        </a>
        <a
          onClick={() => navigate("/signup/email")}
          className="login-email-btn"
        >
          Sign up with email
        </a>
        <p id="terms">
          By creating an account you agree with our{" "}
          <a href="#">Terms of Service</a> ,<a href="#">Privacy Policy</a>, and
          our default <a href="#">Notification Settings.</a>
        </p>
        <div className="verify-button-group-hor">
          <button
            className="verify-home-button" /* onClick={() => navigate("/")} */
            onClick={() =>
              navigate(isMobileVerified ? "/signup/complete" : "/", {
                state: { mobile: formData.mobile },
              })
            }
          >
            Go to Home
          </button>

          <button
            className="verify-complete-button"
            // onClick={() =>
            //   handleSignupAttempt(() => navigate("/Consumer-Signup2"))
            // }
            onClick={() => navigate("/signup/setup-profile")}
            disabled={!isMobileVerified}
            style={{
              opacity: !isMobileVerified ? 0.5 : 1,
              cursor: !isMobileVerified ? "not-allowed" : "pointer",
            }}
            title={
              !isMobileVerified ? "Please verify your mobile number first." : ""
            }
          >
            Complete Signup
          </button>
        </div>
        <p id="terms">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")}>Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signin1;
