import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Navbar/Navbar.css";

function Login({ onClose }) {
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const loginRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        onClose(); // Close the popup and navigate to the base URL
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handle_manual_login = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    // console.log("in api route client side", data);
    try {
      const response = await axios.post("http://localhost:5000/login", data, {
        withCredentials: true, // Include cookies in the request
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Login successful!");
        onClose(); // Close the login popup
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      // console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" ref={loginRef}>
        {!showEmailLogin ? (
          <>
            <h1 className="login-title">Log in to your account</h1>
            <p className="login-subtitle">Welcome back !!!</p>
            {/* <button className="login-google-btn"> */}
            <a href="http://localhost:5000/google" className="login-google-btn">
              <svg
                style={{ height: "20px", width: "20px" }}
                viewBox="0 0 40 40"
              >
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
              Continue with Google
            </a>
            {/* </button> */}
            <button
              className="login-email-btn"
              onClick={() => setShowEmailLogin(true)}
            >
              Continue with number/email
            </button>
            <button className="login-stay-logged-out-btn" onClick={onClose}>
              Stay Logged Out
            </button>
            <p className="login-signup-text">
              Don't have an account?{" "}
              <span
                className="login-signup-link"
                onClick={() => {
                  onClose();
                  navigate("Consumer-signup");
                }}
              >
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <div>
              <FontAwesomeIcon
                icon="fa-solid fa-circle-xmark"
                style={{ color: "#36383a" }}
              />{" "}
              <h1 className="login-title">Log In</h1>
              <p className="login-subtitle">
                Enter your Registered Mobile no or Email
              </p>
              <form className="login-form" onSubmit={handle_manual_login}>
                <label className="login-label">Mobile no / Email</label>
                <input
                  name="email"
                  type="text"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className="login-label">Password</label>
                <div className="form2-password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form2-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="form2-eye-icon"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button type="submit" className="login-submit-btn">
                  Log In
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
