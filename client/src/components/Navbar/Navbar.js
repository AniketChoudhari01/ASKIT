import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoSearch } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [mail, setMail] = useState("");
  const location = useLocation();
  const [activeSegment, setActiveSegment] = useState(null);
  const navigate = useNavigate();

  // Support Component State/Logic
  // No state needed for Support component

  // Notification Component State/Logic
  // No state needed for Notification component

  // Language Component State/Logic
  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese (Simplified)" },
    { value: "chinese-traditional", label: "Chinese (Traditional)" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "hindi", label: "Hindi" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
    { value: "russian", label: "Russian" },
    { value: "italian", label: "Italian" },
    { value: "turkish", label: "Turkish" },
    { value: "dutch", label: "Dutch" },
    { value: "swedish", label: "Swedish" },
    { value: "danish", label: "Danish" },
    { value: "norwegian", label: "Norwegian" },
    { value: "finnish", label: "Finnish" },
    { value: "greek", label: "Greek" },
    { value: "thai", label: "Thai" },
    { value: "vietnamese", label: "Vietnamese" },
    { value: "polish", label: "Polish" },
    { value: "ukrainian", label: "Ukrainian" },
    { value: "hebrew", label: "Hebrew" },
    { value: "czech", label: "Czech" },
    { value: "hungarian", label: "Hungarian" },
    { value: "romanian", label: "Romanian" },
    { value: "indonesian", label: "Indonesian" },
    { value: "malay", label: "Malay" },
    { value: "filipino", label: "Filipino" },
    { value: "swahili", label: "Swahili" },
    { value: "bengali", label: "Bengali" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "marathi", label: "Marathi" },
    { value: "urdu", label: "Urdu" },
    { value: "persian", label: "Persian" },
    { value: "punjabi", label: "Punjabi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "amharic", label: "Amharic" },
    { value: "somali", label: "Somali" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredLanguages(
      languages.filter((lang) => lang.label.toLowerCase().includes(value))
    );
  };

  const handleSelect = (language) => {
    setSearchTerm(language.label); // Set the selected language directly in the input
  };

  // Login Component State/Logic
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // NavBar Component Logic
  const handleSegmentChange = (segment) => {
    setActiveSegment(activeSegment === segment ? null : segment);
  };

  const handleLoginStatus = (status) => {
    setMail(status);
    setShowLogin(false);
  };

  const handleVerification = () => {
    setShowLogin(true);
  };

  // Support Component
  const Support = () => {
    return (
      <div className="header-user-help">
        <h3 className="header-title">User Help</h3>
        <ul className="header-list">
          <li className="header-list-item">How to Videos</li>
          <li className="header-list-item">Account settings</li>
          <li className="header-list-item">FAQ</li>
          <li className="header-list-item">Technical help</li>
        </ul>
      </div>
    );
  };

  // Notification Component
  const Notification = () => {
    return (
      <div className="header-service-listing">
        <h3 className="header-title">Service & listing</h3>
        <ul className="header-list">
          <li className="header-list-item">Service categories</li>
          <li className="header-list-item">Pricing & plans</li>
        </ul>
      </div>
    );
  };

  // Language Component
  const Language = () => {
    return (
      <div className="language-selector">
        <h3 className="header-title">Set Language</h3>
        <p className="header-subtitle">
          Search and select your preferred language
        </p>

        <input
          type="text"
          className="language-input"
          placeholder="Search for a language..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {searchTerm && !languages.find((lang) => lang.label === searchTerm) && (
          <ul className="language-dropdown-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <li
                  key={language.value}
                  className="language-dropdown-item"
                  onClick={() => handleSelect(language)}
                >
                  {language.label}
                </li>
              ))
            ) : (
              <li className="language-dropdown-item">No results found</li>
            )}
          </ul>
        )}
      </div>
    );
  };

  // Login Component
  const Login = ({ onClose }) => {
    return (
      <div className="login-container">
        <div className="login-card">
          {!showEmailLogin ? (
            <>
              <h1 className="login-title">Log in to your account</h1>
              <p className="login-subtitle">Welcome back !!!</p>

              <button className="login-google-btn">
                <img
                  src="{googleIcon}"
                  alt="Google Icon"
                  className="login-google-icon"
                />
                Continue with Google
              </button>

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
                <a href="/signup" className="login-signup-link">
                  Sign up
                </a>
              </p>
            </>
          ) : (
            <>
              <h1 className="login-title">Log In</h1>
              <p className="login-subtitle">
                Enter your Registered Mobile no or Email
              </p>

              <form className="login-form">
                <label className="login-label">Mobile no / Email</label>
                <input type="text" className="login-input" required />

                <label className="login-label">Password</label>
                <input type="password" className="login-input" required />

                <button type="submit" className="login-submit-btn">
                  Log In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="header-navbar">
      <div className="header-navbar-left">
        <h1 className="header-logo">
          <Link to="/">AskIT</Link>
        </h1>
      </div>
      {location.pathname !== "/" && (
        <div className="header-navbar-center">
          <div className="header-search-wrapper">
            <div className="header-locat">
              <div className="header-location">
                <MdLocationPin />
                <span>Puducherry</span>
              </div>
            </div>
            <div className="header-search-box">
              <input type="text" placeholder="Search" />
              <div className="header-search-but">
                <button className="header-search-button">
                  <IoSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="header-navbar-right">
        {[
          { id: "support", label: "Support", component: <Support /> },
          {
            id: "notifications",
            label: (
              <>
                <IoIosNotifications /> Notification
              </>
            ),
            component: <Notification />,
          },
          {
            id: "language",
            label: (
              <>
                <AiOutlineGlobal /> English
              </>
            ),
            component: <Language />,
          },
        ].map(({ id, label, component }) => (
          <div
            key={id}
            className={`header-nav-item ${
              activeSegment === id ? "active" : ""
            }`}
          >
            <a onClick={() => handleSegmentChange(id)} href={`#${id}`}>
              {label}
            </a>
            {activeSegment === id && (
              <div className="header-popup-box">{component}</div>
            )}
          </div>
        ))}

        <p className="header-nav-item" onClick={handleVerification}>
          <CiCirclePlus /> Login
        </p>

        {showLogin && (
          <div className="verify-popup-overlay">
            <Login onClose={() => setShowLogin(false)} />
          </div>
        )}

        <button
          className="header-sign-up"
          onClick={() => navigate("/Consumer-Signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

export default NavBar;
