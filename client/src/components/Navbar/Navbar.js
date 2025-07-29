import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoSearch } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdPersonAdd } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "../Sidebar/Sidebar";
// import Login from "../Login/Email_Login";
import Cookies from "js-cookie";
import Profile from "../../pages/Profile/Profile";
import axios from "axios";
import { useUser } from "../../context/UserContext";
function NavBar() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useUser();
  const profileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [showUser, setShowUser] = useState(false);
  const [mail, setMail] = useState("");
  const location = useLocation();
  const [activeSegment, setActiveSegment] = useState(null);
  const [activePopup, setActivePopup] = useState("");

  useEffect(() => {
    const handleOpenLoginPopup = () => {
      setActivePopup("login");
      document.body.classList.add("login-active");
    };

    // Add event listener for the custom event
    window.addEventListener("openLoginPopup", handleOpenLoginPopup);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("openLoginPopup", handleOpenLoginPopup);
    };
  }, []);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActivePopup(hash);
      if (hash === "login") {
        document.body.classList.add("login-active");
      } else {
        document.body.classList.remove("login-active");
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.body.classList.remove("login-active");
    };
  }, []);

  const handleLoginClick = () => {
    window.location.hash = "login";
    document.body.classList.add("login-active");
  };

  const handleProfileClick = () => {
    <Profile />;
  };

  const handleClosePopup = () => {
    window.location.hash = "";
    document.body.classList.remove("login-active");
    navigate(location.pathname, { replace: true });
  };

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

  const handleSegmentChange = (segment) => {
    if (activeSegment === segment) {
      setActiveSegment(null);
      navigate(location.pathname, { replace: true }); // Clear the hash
    } else {
      setActiveSegment(segment);
      navigate(`${location.pathname}#${segment}`, { replace: true }); // Update the hash
    }
  };

  const handleLoginStatus = (status) => {
    setMail(status);
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

  return (
    <>
      <div className="header-navbar">
        <div className="header-navbar-left">
          <h1 onClick={() => navigate("/")} className="header-logo">
            Ask IT
          </h1>
          {/* <div className="header-navbar"> */}
          {/* <h1 onClick={() => navigate("/")} className="header-logo">
              Ask IT
            </h1> */}

          {/* ✅ Hamburger only on small screens */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <GiHamburgerMenu />
          </button>
          {/* </div> */}

          {/* ✅ Sidebar Component */}
          <Sidebar
            isAuthenticated={isAuthenticated}
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
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
            {
              id: "support",
              label: "Support",
              component: <Support />,
            },
            {
              id: "notifications",
              label: (
                <>
                  <IoMdNotificationsOutline className="btn-icon" />
                  Notification
                </>
              ),
              component: <Notification />,
            },
            {
              id: "language",
              label: (
                <>
                  <AiOutlineGlobal className="btn-icon" />
                  English
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
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleSegmentChange(id);
                }}
              >
                {label}
              </a>
              {activeSegment === id && (
                <div className="header-popup-box">{component}</div>
              )}
            </div>
          ))}
          {isAuthenticated ? (
            <>
              <button
                className="header-user-profile"
                // onClick={() => setShowUser((prev) => !prev)}
                onClick={() => navigate("/profile/manage")}
              >
                <div className="header-user-photo">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="User Profile"
                    className="header-user-avatar"
                  />
                </div>
                <div className="header-user-right">
                  {user.name || "Name"}
                  <hr className="header-user-underline" />
                  {user.email || "@Venky2342"}
                </div>
              </button>
              {showUser && (
                <div className="profile-overlay" ref={profileRef}>
                  <Profile onClose={() => setShowUser(!showUser)} />
                </div>
              )}
            </>
          ) : (
            <div className="header-login-signup">
              <button
                className={`header-nav-item login-btn`}
                onClick={() => navigate("/login")}
              >
                <MdPersonAdd className="btn-icon" />
                Sign in
              </button>
              {/* {activePopup === "login" && (
                <div className="verify-popup-overlay">
                  <Login onClose={handleClosePopup} />
                </div>
              )} */}

              <button
                className="header-nav-item  header-sign-up"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
