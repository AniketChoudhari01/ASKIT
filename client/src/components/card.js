import React from "react";
import "../components/card.css";
import { MdVerified } from "react-icons/md";

export const Card = ({ data }) => {
  const daysoftheWeek = [
    { full: "Sunday", short: "S" },
    { full: "Monday", short: "M" },
    { full: "Tuesday", short: "T" },
    { full: "Wednesday", short: "W" },
    { full: "Thursday", short: "T" },
    { full: "Friday", short: "F" },
    { full: "Saturday", short: "S" },
  ];

  return (
    <div className="card-card">
      <div className="card-card-header">
        <div className="card-icons">
          <i className="fas fa-home"></i>
          <i className="fas fa-bookmark"></i>
          <i className="fas fa-info-circle"></i>
        </div>
        <i className="fas fa-ellipsis-h options"></i>
      </div>

      <div className="card-card-profile">
        <img
          src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
          alt="User profile"
          className="card-profile-image"
        />
        <h2 className="card-name">
          {data.firstName + " " + data.lastName}{" "}
          {data.isVerified && <MdVerified />}
        </h2>
        <p className="card-profession">{data.professionName}</p>
      </div>
      <div className="card-card-details">
        <p>
          <strong>Experience:</strong>{" "}
          {data.experiences && data.experiences.length > 0
            ? data.experiences[0]
            : "N/A"}{" "}
          Years
        </p>
        <p>
          <strong>Skills:</strong>{" "}
          {data.servicesOffered && data.servicesOffered.length > 0
            ? data.servicesOffered[0]
            : "N/A"}
        </p>
        <p>
          <strong>Locations Covered:</strong>{" "}
          {Array.isArray(data.locationCovered) &&
          data.locationCovered.length > 0
            ? data.locationCovered.join(", ")
            : "N/A"}
        </p>
        <p>
          <strong>Available on:</strong>
        </p>
        <div className="card-availability">
          {daysoftheWeek.map((day, index) => (
            <span
              key={index}
              className={
                data.workingDays && data.workingDays[day.full]
                  ? "card-available-day"
                  : "card-unavailable-day"
              }
            >
              {day.short}
            </span>
          ))}
        </div>
      </div>

      <div className="card-card-footer">
        <div className="card-price">
          <span className="card-price-amount">{data.pricePerDay}/day</span>
        </div>
        <button className="card-call-button">
          <i className="fas fa-phone-alt"></i> Call
        </button>
      </div>

      <div className="card-card-rating">
        <strong>{data.rating ?? "N/A"}</strong> ⭐
        <span>({data.rating ?? 0} Reviews)</span>
      </div>
      <hr />
      <p className="card-posted-date">Posted on: {data.postedDate || "N/A"}</p>
    </div>
  );
};
