import React from "react";
import "./Styles/ProgressBar.css";

const steps = ["Service Details", "Location & Contact", "Payment & Certifications", "Preview & Submit", "Additional Information"];

const ProgressSteps = ({ currentStep }) => {
  const getProgressWidth = () => {
    return `${(currentStep / (steps.length - 1)) * 84}%`;
  };

  return (
    <div className="progress-container">
      <div className="progress-bar-background"></div>
      <div
        className="progress-bar-active"
        style={{ width: getProgressWidth() }}
      ></div>
      <div className="progress-steps">
        {steps.map((label, index) => (
          <div key={index} className="progress-step">
            <div
              className={`step-circle ${index <= currentStep ? "active" : ""}`}
            >
              <div
                className={`inner-circle ${
                  index <= currentStep ? "filled" : ""
                }`}
              ></div>
            </div>
            <span
              className={`step-label ${
                index <= currentStep ? "active-label" : ""
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
