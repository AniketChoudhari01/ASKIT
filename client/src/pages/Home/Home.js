import React from "react";
import { useNavigate } from "react-router-dom";
import cardImage from "../../Assets/card1.png";
import cardImagee from "../../Assets/video1.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="Home">
      {/* Header Component */}
      <div className="home-hero">
        <div className="home-hero-overlay"></div>
        <div className="home-learn-about">Learn about Ask IT</div>
        <h1>Over a million skilled professionals at your fingertips</h1>
        <p>Your go-to destination for finding trusted experts.</p>
        <div className="home-search-bar">
          <div className="home-location">
            <div className="home-location-icon"></div>
            <div className="home-location-text">
              <label htmlFor="Location">Location</label>
              <select name="Place" id="place">
                <option value="default">Default</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </div>
          </div>
          <input
            className="home-search-space"
            type="text"
            placeholder="Search"
          />
          <button
            className="home-search-button"
            onClick={() => navigate("/Search")}
          >
            {" "}
          </button>
        </div>
      </div>

      {/* Service Cards Component */}
      <div className="home-service-cards">
        <div className="home-card">
          <div className="home-card-content">
            <h2>Post your service</h2>
            <p>Have a service to offer? List it here to reach more people.</p>
          </div>
          <div className="home-card-bottom">
            <button
              className="home-btn"
              onClick={() => navigate("/Provider-Signup")}
            >
              Get Started ↗
            </button>
            <div className="home-card-image">
              <img src={cardImage} alt="Post Service" />
            </div>
          </div>
        </div>
        <div className="home-card">
          <div className="home-card-content">
            <h2>Find Services</h2>
            <p>Need a reliable service? Find trusted professionals here.</p>
          </div>
          <div className="home-card-bottom">
            <button
              className="home-btn"
              onClick={() => navigate("/Consumer-Signup")}
            >
              Get Started ↗
            </button>
            <div className="home-card-image">
              <img src={cardImage} alt="Find Service" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Component */}
      <div className="home-features-section">
        <h2>We're BIG on what matters to you</h2>
        <p>
          Find your trustable connection effortlessly, without the hassle. Get
          the job done quickly, and with confidence.
        </p>

        <div className="home-features">
          <div className="home-feature">
            <h3>Search</h3>
            <p>Search for what you need with ease and precision.</p>
            <img src={cardImage} alt="Search" />
          </div>
          <div className="home-feature">
            <h3>Shortlist</h3>
            <p>Save and organize your top picks effortlessly.</p>
            <img src={cardImage} alt="Shortlist" />
          </div>
          <div className="home-feature">
            <h3>Select</h3>
            <p>
              Choose confidently and connect directly with the best options.
            </p>
            <img src={cardImage} alt="Select" />
          </div>
        </div>

        <div className="home-quick-video-section">
          <div className="home-video-thumbnail">
            <img src={cardImagee} alt="Quick Video" />
          </div>
          <div className="home-video-content">
            <h3>Quick how-to videos</h3>
            <p>Watch our simple guides to make the most of ASKIT</p>
            <p className="home-video-title">How to Search for Services</p>
            <button className="home-view-more-btn">View More ↗</button>
          </div>
        </div>
      </div>

      {/* Stats And Luck Section Component */}
      <div className="home-stats-luck-section">
        {/* Header Section */}
        <h2>
          Explore thousands of trusted connections
          <br /> tailored to your everyday needs.
        </h2>

        {/* Stats Section */}
        <div className="home-stats">
          <div className="home-stat">
            <h3>200+</h3>
            <p>services Providers</p>
          </div>
          <div className="home-stat">
            <h3>200+</h3>
            <p>visitors</p>
          </div>
          <div className="home-stat">
            <h3>200+</h3>
            <p>connection made per sec</p>
          </div>
          <div className="home-stat">
            <h3>200+</h3>
            <p>verified users</p>
          </div>
        </div>

        {/* Luck Checker Section */}
        <div className="home-luck-checker">
          <div className="home-luck-placeholder">
            {/* Placeholder for additional content */}
          </div>
          <div className="home-luck-content">
            <div className="home-luck-text">
              <h3>Check your luck today</h3>
              <p>Today's Lucky Thought Just for You!</p>
            </div>
            <button className="home-check-now-btn">Check now</button>
          </div>
        </div>
      </div>

      {/* Review Component */}
      <div className="home-review">
        <div className="home-review-content">
          <div className="home-review-content-text">
            <h2>What our Coustumer say</h2>
            <p>
              Rated 4.7/5 based on 28,370 reviews Showing our 4 & 5 star reviews
            </p>
          </div>
          <div className="home-review-cards">
            <div className="home-review-card">
              <div className="home-review-card-content">
                <h3>Great Work</h3>
                <p>
                  "I was able to find a reliable service provider in minutes. I
                  highly recommend ASKIT to anyone who needs a service."
                </p>
              </div>
              <div className="home-review-card-image">
                <img src="review-image1.png" alt="John Doe" />
                <div className="home-review-card-username">
                  <p>John Doe</p>
                  <hr />
                  <p>@JohnDoe4567</p>
                </div>
              </div>
            </div>
            <div className="home-review-card">
              <div className="home-review-card-content">
                <h3>Great Work</h3>
                <p>
                  "I was able to find a reliable service provider in minutes. I
                  highly recommend ASKIT to anyone who needs a service."
                </p>
              </div>
              <div className="home-review-card-image">
                <img src="home-review-image1.png" alt="John Doe" />
                <div className="home-review-card-username">
                  <p>John Doe</p>
                  <hr />
                  <p>@JohnDoe4567</p>
                </div>
              </div>
            </div>
            <div className="home-review-card">
              <div className="home-review-card-content">
                <h3>Great Work</h3>
                <p>
                  "I was able to find a reliable service provider in minutes. I
                  highly recommend ASKIT to anyone who needs a service."
                </p>
              </div>
              <div className="home-review-card-image">
                <img src="review-image1.png" alt="John Doe" />
                <div className="home-review-card-username">
                  <p>John Doe</p>
                  <hr />
                  <p>@JohnDoe4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
