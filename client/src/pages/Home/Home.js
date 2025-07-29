import React from "react";
import { useNavigate } from "react-router-dom";
import cardImage from "../../Assets/card1.png";
import cardImagee from "../../Assets/video1.png";
import home2CardImg from "../../Assets/verify/home2_seek.png";
import homeStatsCard from "../../Assets/verify/home-stats.png";
import searchCardImg from "../../Assets/verify/home-search-card.png";
import selectCardImg from "../../Assets/verify/home-select-card.png";
import shortlistCardImg from "../../Assets/verify/home-shortlist-card.png";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import { LuCirclePlay } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { useUser } from "../../context/UserContext";
import ReviewCarousel from "./ReviewCarousel/ReviewCarousel";
const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  return (
    <>
      <div className="Home">
        {/* Header Component */}
        <div className="home-hero">
          <div className="home-hero-overlay"></div>
          <div className="home-learn-about">
            <span>
              <LuCirclePlay className="btn-icon" />
              Learn about Ask IT
            </span>
          </div>
          <h1>Over a million skilled professionals at your fingertips</h1>
          <p>Your go-to destination for finding trusted experts.</p>
          <div className="home-search-bar">
            <div className="home-location">
              <IoLocationOutline className="btn-icon" />
              <div className="home-location-text">
                <label htmlFor="Location">Location</label>
                <hr className="header-user-underline" />
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
              <span className="icon-container">
                <IoSearchOutline className="btn-icon" />
              </span>
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
                onClick={() =>
                  isAuthenticated
                    ? navigate("/profile/manage")
                    : navigate("/signup")
                }
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
              <h2>Post a Task and Get Help</h2>
              <p>
                Need a help with something? Post your requirement and let the
                professionals around you handle the rest.
              </p>
            </div>
            <div className="home-card-bottom">
              <button
                className="home-btn"
                onClick={() => navigate("/Consumer-Signup")}
              >
                Get Started ↗
              </button>
              <div className="home-card-image">
                <img src={home2CardImg} alt="Find Service" />
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
              <img src={searchCardImg} alt="Search" />
            </div>
            <div className="home-feature">
              <h3>Shortlist</h3>
              <p>Save and organize your top picks effortlessly.</p>
              <img src={shortlistCardImg} alt="Shortlist" />
            </div>
            <div className="home-feature">
              <h3>Select</h3>
              <p>
                Choose confidently and connect directly with the best options.
              </p>
              <img src={selectCardImg} alt="Select" />
            </div>
          </div>

          <div className="home-quick-video-section">
            <div className="home-video-thumbnail">
              <img src={cardImagee} alt="Quick Video" />
            </div>
            <div className="home-video-content">
              <h3>Quick how to videos</h3>
              <p>Watch our simple guides to make the most of ASKIT</p>
              <p className="home-video-title">How to Search for Services</p>
              <button
                className="home-view-more-btn"
                onClick={() => navigate("/how-to-videos")}
              >
                View More ↗
              </button>
            </div>
          </div>
        </div>

        {/* Stats And Luck Section Component */}
        <div className="home-stats-section">
          {/* Header Section */}
          <div className="home-stats-left">
            <h2>
              Explore thousands of trusted connections
              <br /> tailored to your everyday needs.
            </h2>

            {/* Stats Section */}
            <div className="home-stats">
              <div className="home-stat">
                <p>Profile visits</p>
                <h3>200+</h3>
              </div>
              <div className="home-stat">
                <p>visitors</p>
                <h3>200+</h3>
              </div>
              <div className="home-stat">
                <p>Connection made per sec</p>
                <h3>200+</h3>
              </div>
              <div className="home-stat">
                <p>Referals passed</p>
                <h3>200+</h3>
              </div>
            </div>
          </div>
          <div className="home-stats-right">
            <img src={homeStatsCard} alt="stats card" />
          </div>
        </div>

        {/* Review Component */}
        <div className="home-review">
          <div className="home-review-content">
            <div className="home-review-content-text">
              <h2>What our User say</h2>
              <p>
                Rated 4.7/5 based on 28,370 reviews Showing our 4 & 5 star
                reviews
              </p>
            </div>
            {/* <div className="home-review-cards"> */}
              {/* <div className="home-review-card">
                <div className="home-review-card-content">
                  <h3>Great Work</h3>
                  <p>
                    "I was able to find a reliable service provider in minutes.
                    I highly recommend ASKIT to anyone who needs a service."
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
                    "I was able to find a reliable service provider in minutes.
                    I highly recommend ASKIT to anyone who needs a service."
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
                    "I was able to find a reliable service provider in minutes.
                    I highly recommend ASKIT to anyone who needs a service."
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
              </div> */}
              <ReviewCarousel/>
            {/* </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
