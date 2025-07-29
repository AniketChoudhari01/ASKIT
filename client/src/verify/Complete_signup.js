import { useState, useContext } from "react";
import sigin2Img from "../Assets/verify/signin-left-2.png";
import "./signin1.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Complete_signup() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const fieldOrder = ["name", "email", "password", "confirmPassword"];
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

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
              mobile: formData.mobile,
              password: formData.password,
            }),
          }
        );
        if (response.ok) {
          setUser({
            name: formData.name,
            email: formData.email,
            mobile: user.mobile,
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
        <p>Create your AskIt account using your email address.</p>

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
          />
        </div>
        {shouldShowError("email") && (
          <p className="error-message">{errors.email}</p>
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
          <button type="button" className="verify-home-button">
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

export default Complete_signup;
