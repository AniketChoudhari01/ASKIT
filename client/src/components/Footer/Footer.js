import React from "react";
import "./Footer.css";
import { MdPersonAdd } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="home-footer">
      <div className="home-footer-top">
        <div className="home-footer-join">
          <h3>Join Ask IT</h3>
          <div className="header-login-signup">
            <button
              className={`header-nav-item login-btn`}
              onClick={() => navigate("/login")}
            >
              <MdPersonAdd className="btn-icon" />
              Sign in
            </button>

            <button
              className="header-sign-up"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className="home-footer-middle">
        <div className="home-footer-links">
          <div>
            <h4>Useful Links</h4>
            <ul>
              <li>
                {" "}
                <a> Home </a>
              </li>
              <li>
                {" "}
                <a> List Your Business </a>
              </li>
              <li>
                {" "}
                <a> Categories </a>
              </li>
              <li>
                {" "}
                <a> Blog/Resources </a>
              </li>
              <li>
                {" "}
                <a> Enquire </a>
              </li>
              <li>
                {" "}
                <a> Feedback </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>User Help</h4>
            <ul>
              <li>
                {" "}
                <a> How to Videos </a>
              </li>
              <li>
                {" "}
                <a> Account Settings </a>
              </li>
              <li>
                {" "}
                <a onClick={() => navigate("/faqs")}> FAQ </a>
              </li>
              <li>
                {" "}
                <a> Technical Help </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Service & Listing</h4>
            <ul>
              <li>
                {" "}
                <a> Service Categories </a>
              </li>
              <li>
                {" "}
                <a> Pricing & Plans </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li>
                {" "}
                <a> WhatsApp Chat </a>
              </li>
              <li>
                {" "}
                <a> Email Us </a>
              </li>
              <li>
                {" "}
                <a> Call Us </a>
              </li>
              <li>
                {" "}
                <a> Live Chat </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Additional Resources</h4>
            <ul>
              <li>
                {" "}
                <a> Join Community Forums </a>
              </li>
              <li>
                {" "}
                <a> Blog </a>
              </li>
              <li>
                {" "}
                <a> Terms & Conditions </a>
              </li>
              <li>
                {" "}
                <a> Privacy Policy </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="home-footer-social">
          <h4>Stay Connected:</h4>
          <div className="home-social-icons">
            <a href="#">
              <span className="icon facebook">
                <FaFacebook className="btn-icon" />
              </span>
            </a>
            <a href="#">
              <span className="icon instagram">
                <RiInstagramFill className="btn-icon" />
              </span>
            </a>
            <a href="#">
              <span className="icon twitter">
                <FaSquareXTwitter className="btn-icon" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="home-footer-bottom">
        <div className="home-footer-left">
          <strong className="footer-brand">Ask IT</strong>
          <p className="copy-text">
            Copyright © 2024-2025 AskIT. All rights reserved.
          </p>
        </div>

        <div className="home-footer-download">
          <button className="home-btn-appstore">
            <span className="btn-content">
              <FaApple className="btn-icon" />
              <span className="btn-text">Download on App Store</span>
            </span>
          </button>

          <button className="home-btn-googleplay">
            <span className="btn-content">
              <IoLogoGooglePlaystore className="btn-icon" />
              <span className="btn-text">Get it on Google Play</span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
