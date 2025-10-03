import { useState, useEffect } from "react";
import sigin2Img from "../Assets/verify/signin-left-2.png";
import "./signin1.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Signin2() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTempUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/temp-user`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTempUser(data);
          setFormData((prev) => ({
            ...prev,
            email: data.email || "",
            name: data.name || "",
          }));
        } else {
          console.error("Failed to fetch temporary user data");
        }
      } catch (error) {
        console.error("Error fetching temporary user data:", error);
      }
    };

    fetchTempUser();
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const fieldOrder = ["name", "mobile", "password", "confirmPassword"];

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = `${name[0].toUpperCase() + name.slice(1)} is required`;
    } else {
      switch (name) {
        case "mobile":
          const mobileRegex = /^[0-9]{10}$/;
          if (!mobileRegex.test(value.replace(/\s/g, ""))) {
            error = "Please enter a valid 10-digit mobile number";
          }
          break;
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
        default:
          break;
      }
    }

    return error;
  };

  const validatePreviousFields = (currentFieldName) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    const newErrors = { ...errors };

    for (let i = 0; i < currentIndex; i++) {
      const fieldName = fieldOrder[i];
      const fieldValue = formData[fieldName];

      if (!touchedFields[fieldName] && !fieldValue.trim()) {
        newErrors[fieldName] = validateField(fieldName, fieldValue);
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));

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

  const handleFocus = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validatePreviousFields(name);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const allTouched = {};
    fieldOrder.forEach((field) => {
      allTouched[field] = true;
    });
    setTouchedFields(allTouched);

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
      // console.log("Form submitted successfully!", formData);
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
              email: formData.email,
              name: formData.name,
              mobile: formData.mobile,
              password: formData.password,
            }),
          }
        );
        if (response.ok) {
          navigate("/");
          toast.success("User registered successfully!");
        }
      } catch (error) {
        console.error("Error registering user:", error);
      }
    } else {
      const firstErrorField = fieldOrder.find((field) => newErrors[field]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
    }
  };

  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || submitAttempted) && errors[fieldName];
  };

  return (
    <div className="signin1-container">
      <div className="left">
        <img src={sigin2Img} alt="sign up" />
      </div>
      <div className="right">
        <h1>Sign in</h1>
        <p>
          Your Google account <strong>{tempUser?.email || "xyz"}</strong> will
          be connected to your new Ask IT account
        </p>
        <p>
          Wrong identity?{" "}
          <a href="#" style={{ textDecoration: "none", color: "#666" }}>
            Start over
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
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

          {/* Mobile */}
          <label htmlFor="mobile">
            Mobile number<span>*</span>
          </label>
          <div className="input-verify input-space">
            <input
              type="text"
              id="mobile"
              name="mobile"
              className="verify-phone-input"
              value={formData.mobile}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          {shouldShowError("mobile") && (
            <p className="error-message">{errors.mobile}</p>
          )}

          {/* Password */}
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
            <span onClick={togglePasswordVisibility} className="form2-eye-icon">
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {shouldShowError("password") && (
            <p className="error-message">{errors.password}</p>
          )}

          {/* Confirm Password */}
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
              onClick={toggleConfirmPasswordVisibility}
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
            <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>,
            and our default <a href="#">Notification Settings.</a>
          </p>

          <div className="verify-button-group-hor">
            <button type="button" className="verify-home-button">
              Back
            </button>
            <button type="submit" className="verify-complete-button">
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin2;
