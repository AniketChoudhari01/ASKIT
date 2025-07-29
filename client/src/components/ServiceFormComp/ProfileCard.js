import "./Styles/ProfileCard.css";
import React from "react";
import {
  FaWhatsapp,
  FaStar,
  FaPhoneAlt,
  FaBookmark,
  FaComments,
  FaFlag,
  FaShareAlt,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { PiHammerBold } from "react-icons/pi";
import svg from "../../Assets/ServiceForm/ProfileCardBottom.svg";
import "./Styles/ProfileCard.css";
import profileImg from "../../Assets/verify/profile-photo.png";
const CarpenterCardPreview = ({
  formData = {},
  firstName = formData.firstName || "Kathir",
  lastName = formData.lastName || "",
  professionName = formData.professionName || "Carpenter",
  company = formData.company || "",
  experience = formData.experience || "5 years",
  services = formData.service || "",
  jobDescription = formData.jobDescription || "",
  image = formData.image || null,
  address = formData.address || "",
  city = formData.city || "Coimbatore",
  state = formData.state || "Tamil Nadu",
  availableWeekends = formData.availableWeekends || false,
  rating = 0,
  reviews = 0,
}) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const locationLabel =
    [address, city, state].filter(Boolean).join(", ") ||
    "Gandhipuram, Coimbatore";

  const serviceTags = services
    ? services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  // console.log("profile data in card ", formData);
  return (
    <div className="card-preview-container">
      <div className="card-header">
        <div className="card-image-wrapper">
          <img
            src={
              image
                ? typeof image === "string"
                  ? image
                  : URL.createObjectURL(image)
                : profileImg
            }
            alt={fullName || "Profile"}
            className="card-profile-image"
          />
        </div>
        <div className="card-header-info">
          <h2 className="card-name">{fullName || "Kathir"}</h2>
          <p className="card-profession">{professionName || "Carpenter"}</p>
          <p className="card-location">
            <MdLocationOn className="btn-icon" />
            {locationLabel}
          </p>
        </div>
      </div>

      {company && <p className="card-company">Company: {company}</p>}

      {serviceTags.length > 0 && (
        <div className="card-service-tags">
          {serviceTags.map((tag, idx) => (
            <span key={idx} className="card-service-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {jobDescription && (
        <div className="card-about-section">
          <h3 className="card-about-title">About Me</h3>
          <p className="card-about-text">{jobDescription}</p>
          <div className="card-about-info">
            {availableWeekends != null && (
              <span className="card-weekend-availability">
                <IoMdTime />
                {availableWeekends ? "Available on weekends" : "Weekdays only"}
              </span>
            )}
            {experience && (
              <span className="card-experience">
                <PiHammerBold /> {experience}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="card-rating-section">
        <div className="card-rating-info">
          <span className="card-rating-number">{rating.toFixed(1)}</span>
          <div className="card-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(rating)
                    ? "star-icon-filled"
                    : "star-icon-empty"
                }
              />
            ))}
          </div>
          <span className="card-review-text">
            Based on {reviews.toLocaleString()} reviews
          </span>
        </div>
        <button className="card-quote-button">Get quotation</button>
      </div>

      <div className="card-footer">
        <img src={svg} alt="Footer" className="card-footer-image" />
        <div className="card-footer-actions">
          <button className="card-action">
            <FaFlag className="btn-icon" />
            Report
          </button>
          <button className="card-action">
            <FaComments className="btn-icon" />
            Chat
          </button>
          <div className="card-phone-icon">
            <FaPhoneAlt className="btn-icon" />
          </div>
          <button className="card-action">
            <FaShareAlt className="btn-icon" />
            Share
          </button>
          <button className="card-action">
            <FaBookmark className="btn-icon" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarpenterCardPreview;
