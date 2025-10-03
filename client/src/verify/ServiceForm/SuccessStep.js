import React from "react";
import CardComponent from "../../components/ServiceFormComp/ProfileCard";
import "./Styles/SuccessStep.css";
import { useNavigate } from "react-router-dom";
import left_panel_img from "../../Assets/verify/success_left_bg.png";
const SuccessStep = ({ formData }) => {
  const navigate = useNavigate();
  // console.log("Form Data in Success Step:", formData);      
  return (
      <div className="success-step-container">
        <div className="left-panel">
          <div class="image-wrapper">
            <img src={left_panel_img} alt="success card image" />
          </div>
          <h2>🎉 Congratulations!</h2>
          <h4>You are now part of ASK IT family</h4>
          <p>
            <i>
              Your service is live, and the journey to connect, grow, and thrive
              starts now.
              <br /> We’re thrilled to have you onboard — whether you’re here to
              help or get helped.
            </i>
          </p>
          <h5>#GrowWithASKIT</h5>
          <button className="request-btn" onClick={()=>navigate("/profile/manage")}>Take me to account</button>
          <button className="request-btn">Share with friends</button>
          {/* Optional: buttons to edit, go to dashboard, etc */}
        </div>

        <div className="right-panel">
          <div className="img-content">
            <CardComponent {...formData} />
          </div>
        </div>
      </div>
  );
};

export default SuccessStep;
