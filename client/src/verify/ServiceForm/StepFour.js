// src/components/steps/StepFour.js
import React from "react";
import "./Styles/StepFour.css";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdCheckCircle } from "react-icons/md";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import { useState } from "react";
const Section = ({ title, children }) => (
  <div className="stepfour-section">
    <h3 className="stepfour-section-title">{title}</h3>
    <div className="stepfour-section-content">{children}</div>
  </div>
);

const PreviewItem = ({ label, value }) => (
  <div className="stepfour-preview-item">
    <span className="stepfour-label">{label}:</span>
    <span className="stepfour-value">{value}</span>
  </div>
);

const PreviewList = ({ label, items }) => (
  <div className="stepfour-preview-item">
    <span className="stepfour-label">{label}:</span>
    <ul className="stepfour-list">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

const PreviewImage = ({ label, src }) => (
  <div className="stepfour-image-preview">
    <span className="stepfour-label">{label}:</span>
    <br />
    <img src={src} /* alt={label} */ className="stepfour-img" />
    {src ? (
      <p style={{ color: "#aaa9a9" }}>Submitted</p>
    ) : (
      <p style={{ color: "#aaa9a9" }}>Not Submitted</p>
    )}
  </div>
);

const PreviewFile = ({ label, file, url }) => (
  <div className="stepfour-file-preview">
    <span className="stepfour-label">{label}:</span>
    {file?.name ? (
      <a href={url} download={file?.name} className="stepfour-download-link">
        {file.name}
      </a>
    ) : (
      <p style={{ color: "#aaa9a9" }}>Not Submitted</p>
    )}
  </div>
);

const StepFour = ({ formData, onBack, onSaveDraft, onPost, isLoading }) => {
  const [loadMssg, setLoadMssg] = useState("");
  // console.log("step 4 ", formData);
  // console.log("loading ", isLoading);
  const updateMessage = (message) => {
    // console.log("updateMessage called with:", message);
    setLoadMssg(message);
  };
  // console.log("Location Covered: ", formData.locationCovered.name);

  return (
    <>
      {" "}
      {isLoading && <LoadingOverlay message={loadMssg} />}
      <div className="stepfour-container">
        <h2 className="stepfour-title">
          <span className="title-wrapper">
            <IoSettingsOutline className="service-icon" />
            Services detail
          </span>
        </h2>
        <Section title="Personal & Professional">
          <div className="full-name">
            <PreviewItem label="First Name" value={`${formData.firstName}`} />
            <PreviewItem label="Last Name" value={`${formData.lastName}`} />
          </div>
          <PreviewItem
            label="Profession Name"
            value={formData.professionName}
          />
          {formData.company && (
            <PreviewItem
              label="Enterprise/Company Name"
              value={formData.company}
            />
          )}
          <PreviewItem label="Experience" value={formData.experience} />
          <Section title="Services you provide">
            <div className="stepfour-preview-item">
              <div className="stepfour-services-box">
                {formData.services.split(",").map((service, index) => (
                  <span key={index} className="service-badge">
                    {service.trim()}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          <PreviewItem label="Description" value={formData.jobDescription} />
          {formData.image && (
            <PreviewImage label="Profile Image" src={formData.image} />
          )}
        </Section>
        <h2 className="stepfour-title">
          <span className="title-wrapper">
            <IoLocationOutline className="service-icon" />
            Location details
          </span>
        </h2>
        <Section title="Location covered">
          {/* map. */}
          {/* {formData.locationCovered.map((item, index) => (
            <PreviewItem key={index} label={`Area ${index + 1}`} value={formData.locationCovered.name} />
          ))} */}
          <PreviewItem
            label="Area 1"
            value={formData.locationCovered?.name || ""}
          />

          {/* <PreviewItem label="City" value={formData.city} />
        <PreviewItem label="State" value={formData.state} /> */}
        </Section>
        <h2 className="stepfour-title">
          <span className="title-wrapper">
            <CiPhone className="service-icon" />
            Contact details
          </span>
        </h2>
        <Section title="Contact">
          <PreviewList label="Mobile Numbers" items={formData.mobileNumbers} />
          <PreviewList
            label="WhatsApp Numbers"
            items={formData.whatsappNumbers}
          />
          <PreviewItem label="Email" value={formData.email} />
          <PreviewItem
            label="Available Weekends"
            value={formData.availableWeekends ? "Yes" : "No"}
          />
        </Section>
        {formData.aadhaar && (
          <PreviewImage
            label="Aadhaar Card (for trust purposes)"
            src={formData.aadhaar}
          />
        )}
        <h2 className="stepfour-title">
          <span className="title-wrapper">
            <RiSecurePaymentLine className="service-icon" />
            Payment & Certifications
          </span>
        </h2>
        <Section title="Quotation & Certifications">
          {formData.quotationFile && (
            <PreviewFile
              label="Quotation"
              file={formData.quotationFile}
              url={formData.quotationUrl}
            />
          )}
          {formData.certifications && formData.certifications.length > 0 && (
            <div className="stepfour-cert-section">
              <span className="stepfour-label">Certifications:</span>
              <div className="stepfour-cert-grid">
                {formData.certificationUrls.map((url, idx) => (
                  <div key={idx} className="stepfour-cert-box">
                    {url.endsWith(".pdf") ? (
                      <span className="stepfour-pdf-name">
                        {formData.certifications[idx].name}
                      </span>
                    ) : (
                      <img
                        src={url}
                        alt={`Cert ${idx + 1}`}
                        className="stepfour-cert-img"
                      />
                    )}
                    <div className="upload-button">
                      <MdCheckCircle className="btn-icon" />
                      <span>Uploaded </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
        <h2 className="stepfour-title">
          <span className="title-wrapper">
            <RiSecurePaymentLine className="service-icon" />
            Additional Information
          </span>
        </h2>
        <Section title={"Additional Information"}>
          <PreviewFile
            label="Terms & Conditions File"
            file={formData.termsFile}
            url={formData.termsUrl}
          />
          <PreviewImage label="Business Logo" src={formData.logoImg} />
          {/* {!formData.logoImg && (
          <p style={{ color: "#aaa9a9" }}>Not Submitted</p>
        )} */}
        </Section>
        <div className="stepfour-actions">
          <button
            onClick={() => {
              onSaveDraft();
              updateMessage("Saving as draft...");
            }}
            className="outline-btn"
          >
            Save as Draft
          </button>
          <div className="btn-group">
            <button onClick={onBack} className="outline-btn">
              Back
            </button>
            <button
              onClick={() => {
                onPost();
                updateMessage("Creating your profile... almost there");
              }}
              className="outline-btn btn-submit"
            >
              Post Services
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepFour;
