import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="home-footer-top">
        <div className="home-footer-join">
          <h3>Join Ask IT</h3>
          <button className="home-btn-signin">Sign in</button>
          <button className="home-btn-signup">Sign up</button>
        </div>
      </div>
      <div className="home-footer-middle">
        <div className="home-footer-links">
          <div>
            <h4>Useful Links</h4>
            <ul>
              <li>Home</li>
              <li>List Your Business</li>
              <li>Categories</li>
              <li>Blog/Resources</li>
              <li>Enquire</li>
              <li>Feedback</li>
            </ul>
          </div>
          <div>
            <h4>User Help</h4>
            <ul>
              <li>How to Videos</li>
              <li>Account Settings</li>
              <li>FAQ</li>
              <li>Technical Help</li>
            </ul>
          </div>
          <div>
            <h4>Service & Listing</h4>
            <ul>
              <li>Service Categories</li>
              <li>Pricing & Plans</li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li>WhatsApp Chat</li>
              <li>Email Us</li>
              <li>Call Us</li>
              <li>Live Chat</li>
            </ul>
          </div>
          <div>
            <h4>Additional Resources</h4>
            <ul>
              <li>Join Community Forums</li>
              <li>Blog</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="home-footer-social">
          <h4>Stay Connected:</h4>
          <div className="home-social-icons">
            <a href="#">
              <span className="icon facebook">F</span>
            </a>
            <a href="#">
              <span className="icon instagram">I</span>
            </a>
            <a href="#">
              <span className="icon twitter">X</span>
            </a>
          </div>
        </div>
      </div>
      <div className="home-footer-bottom">
        <p>
          <strong>Ask IT</strong> Copyright © 2024-2025 AskIT. All rights
          reserved.
        </p>
        <div className="home-footer-download">
          <button className="home-btn-appstore">Download on App Store</button>
          <button className="home-btn-googleplay">Get it on Google Play</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
