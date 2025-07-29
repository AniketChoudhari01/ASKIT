import { useState, useContext, useEffect } from "react";
import sigin2Img from "../Assets/verify/signin-left-2.png";
import "./signin1.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { MdCheckCircle } from "react-icons/md";
import OTP from "../signup/verify/otp";
import { useNavigate } from "react-router-dom";

function Complete_signup_email() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const fieldOrder = ["name", "email", "password", "confirmPassword"];
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  //validate email
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!formData.email || errors.email) {
        setEmailTaken(false); // reset if empty or invalid
        return;
      }
      try {
        const res = await fetch(
          `${
            process.env.REACT_APP_SERVER_URL
          }/check-email?email=${encodeURIComponent(formData.email)}`
        );
        const data = await res.json();

        if (data.exists) {
          // console.log("Email availability check response:", data);
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
          setEmailTaken(true); // mark as taken
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "", // clear error if available
          }));
          setEmailTaken(false); // mark as available
        }
      } catch (error) {
        // console.error("Error checking email:", error);
        setEmailTaken(false); // fallback: allow
      }
    };

    const debounce = setTimeout(checkEmailAvailability, 500); // debounce 500ms

    return () => clearTimeout(debounce);
  }, [formData.email]);

  // Validation function
  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = `${name[0].toUpperCase() + name.slice(1)} is required`;
    } else {
      switch (name) {
        case "password":
          if (value.length < 6) {
            error = "Password must be at least 6 characters long";
          }
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            error = "Passwords do not match";
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Please enter a valid email address";
          }
          break;
        default:
          break;
      }
    }
    return error;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Validate field
    const fieldError = validateField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev, [name]: fieldError };
      // Remove verify error if user is editing email or after verification
      if (name === "email" && isVerified) {
        delete newErrors.verify;
      }
      return newErrors;
    });

    // Special case: update confirmPassword error if password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmPasswordError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  // Handle focus
  const handleFocus = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // OTP verification
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier: email, otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP verified successfully!");
        setIsVerified(true);
        setShowOTP(false);
        setUser((prev) => ({
          ...prev,
          email: email,
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.verify;
          return newErrors;
        });
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP. Please try again.");
    }
  };

  // Send OTP
  const sendOTP = async (email) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/send-email-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent successfully!");
        setShowOTP(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP. Please try again.");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    // Mark all fields as touched
    const allTouched = {};
    fieldOrder.forEach((field) => {
      allTouched[field] = true;
    });
    setTouchedFields(allTouched);
    // Validate all fields
    const newErrors = {};
    fieldOrder.forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const error = validateField(fieldName, fieldValue);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    // Add verify error if not verified
    if (!isVerified) {
      newErrors.verify = "Please verify your email before creating an account.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          }
        );
        if (response.ok) {
          setUser({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
          });
          toast.success("User registered successfully!");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error registering user.");
      }
    } else {
      const firstErrorField = fieldOrder.find((field) => newErrors[field]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      } else if (newErrors.verify) {
        document.getElementById("email")?.focus();
      }
    }
  };

  // Show error if field is touched or submit attempted
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || submitAttempted) && errors[fieldName];
  };
  return (
    <div className="signin1-container">
      <div className="left">
        <img src={sigin2Img} alt="sign up image" />
      </div>
      <div className="right">
        <h1>Sign in</h1>
        <p>Complete your set up</p>
        <label htmlFor="name">
          Name<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input
            type="text"
            id="name"
            name="name"
            className="verify-phone-input"
            value={formData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {shouldShowError("name") && (
          <p className="error-message">{errors.name}</p>
        )}
        <label htmlFor="email">
          Email<span>*</span>
        </label>
        <div className="input-verify input-verify-width">
          <input
            type="email"
            id="email"
            name="email"
            className="verify-phone-input"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isVerified}
          />
          <button
            id="verify-img"
            onClick={() => {
              setTouchedFields((prev) => ({ ...prev, email: true }));
              const emailError = validateField("email", formData.email);
              if (emailError) {
                setErrors((prev) => ({ ...prev, email: emailError }));
                return;
              }
              setShowOTP(true);
              sendOTP(formData.email);
            }}
            style={{
              opacity: !formData.email.trim() || isVerified ? 0.5 : 1,
              cursor:
                !formData.email.trim() || isVerified
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={isVerified || !formData.email.trim() || emailTaken}
            title="Enter a valid email to verify"
          >
            <MdCheckCircle
              style={{
                background: "black",
                color: "#00ff00",
                fontSize: "24px",
                marginRight: "8px",
                borderRadius: "3rem",
              }}
            />
            Verify now
          </button>
        </div>
        {shouldShowError("email") && !isVerified && (
          <p className="error-message">{errors.email}</p>
        )}
        {shouldShowError("verify") && (
          <p className="error-message">{errors.verify}</p>
        )}
        {showOTP && (
          <div className="form2-popup-overlay">
            <OTP
              phoneNumber={formData.email}
              onClose={() => setShowOTP(false)}
              onVerifyOTP={(enteredOTP) =>
                verifyOTP(formData.email, enteredOTP)
              }
              onResendOTP={() => sendOTP(formData.email)}
            />
          </div>
        )}
        <label htmlFor="password">
          Password<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            className="verify-phone-input"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span
            onClick={() => setPasswordVisible((prev) => !prev)}
            className="form2-eye-icon"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {shouldShowError("password") && (
          <p className="error-message">{errors.password}</p>
        )}
        <label htmlFor="confirmPassword">
          Confirm password<span>*</span>
        </label>
        <div className="input-verify input-space">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className="verify-phone-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span
            onClick={() => setConfirmPasswordVisible((prev) => !prev)}
            className="form2-eye-icon"
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {shouldShowError("confirmPassword") && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        <p id="terms">
          By creating an account you agree with our{" "}
          <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and
          our default <a href="#">Notification Settings.</a>
        </p>

        <div className="verify-button-group-hor">
          <button type="button" className="verify-home-button" onClick={()=>navigate("/signup")}>
            Back
          </button>
          <button
            type="submit"
            className="verify-complete-button"
            onClick={handleSubmit}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Complete_signup_email;
