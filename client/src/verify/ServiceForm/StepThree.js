// src/components/steps/StepThree.jsx
import React, { useState, useRef } from "react";
import "./Styles/StepThree.css";
import { FiUploadCloud } from "react-icons/fi";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const StepThree = ({
  formData,
  setFormData,
  onBack,
  onPreview,
  twoStep,
}) => {
  const fileInputRef = useRef(null);
  const certFileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCerts, setUploadingCerts] = useState(false);
  const [errors, setErrors] = useState({});

  // For previews
  const [quotationPreviewUrl, setQuotationPreviewUrl] = useState(
    formData.quotationFile ? URL.createObjectURL(formData.quotationFile) : ""
  );
  const [certPreviews, setCertPreviews] = useState(
    (formData.certifications || []).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  );
  const handleFile = (file) => {
    setUploading(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        quotationFile: file,
        quotationUrl: file.name,
      });
      setQuotationPreviewUrl(URL.createObjectURL(file));
      setUploading(false);
    }, 500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleCertDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) handleCertFiles(files);
  };

  const handleCertFiles = (files) => {
    setUploadingCerts(true);
    setTimeout(() => {
      const newPreviews = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      const updatedPreviews = [...certPreviews, ...newPreviews];
      setCertPreviews(updatedPreviews);
      setFormData({
        ...formData,
        certifications: updatedPreviews.map((item) => item.file),
        certificationUrls: updatedPreviews.map((item) => item.file.name),
      });
      setUploadingCerts(false);
    }, 500);
  };

  const handleCancelUpload = () => {
    setFormData({ ...formData, quotationFile: null, quotationUrl: "" });
    setQuotationPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCertRemove = (index) => {
    const updatedPreviews = [...certPreviews];
    updatedPreviews.splice(index, 1);
    setCertPreviews(updatedPreviews);
    setFormData({
      ...formData,
      certifications: updatedPreviews.map((item) => item.file),
      certificationUrls: updatedPreviews.map((item) => item.file.name),
    });
    if (certFileInputRef.current) certFileInputRef.current.value = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    // if (!formData.quotationFile)
    //   newErrors.quotation = "Quotation file is required";
    // if ((formData.certifications || []).some((f) => f.size > MAX_FILE_SIZE))
    //   newErrors.certifications = "Each certification must be under 10 MB";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onPreview();
    }
  };
  // console.log("location in step 3 ",formData.locationCovered);
  return (
    <>
      <form onSubmit={onSubmit} className="step-three-form">
        <div className="form-group">
          <h2>Enter Payment details</h2>
          <p>Upload your pricing</p>
          <div
            className="upload-container"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="upload-button">
              <FiUploadCloud className="btn-icon" />
              <span>{uploading ? "Uploading..." : "Upload here"}</span>
            </div>
            <p style={{ color: "#888" }}>
              Click to Upload or Drag and drop here (max 10 Mb)
            </p>
          </div>
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            style={{ display: "none" }}
          />
          {errors?.quotation && (
            <p style={{ color: "red" }}>{errors.quotation}</p>
          )}
          {formData.quotationFile && !uploading && !errors?.quotation && (
            <p style={{ marginTop: "0.5rem" }}>
              {formData.quotationFile.name}
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelUpload}
              >
                ❌
              </button>
            </p>
          )}
        </div>

        <div className="form-group">
          <h2>Any certification or recognition</h2>
          <p>Upload your certification or recognition</p>
          <div
            className="upload-container"
            onClick={() => certFileInputRef.current?.click()}
            onDrop={handleCertDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="upload-button">
              <FiUploadCloud className="btn-icon" />
              <span>{uploadingCerts ? "Uploading..." : "Upload here"}</span>
            </div>
            <p style={{ color: "#888" }}>
              Click to Upload or Drag and drop here (max 10 Mb each)
            </p>
          </div>
          <input
            id="certifications"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            ref={certFileInputRef}
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length + certPreviews.length > 5) {
                alert("You can upload up to 5 certifications.");
                return;
              }
              handleCertFiles(files);
            }}
            style={{ display: "none" }}
          />
          {errors.certifications && (
            <p style={{ color: "red" }}>{errors.certifications}</p>
          )}
          {certPreviews.map((item, idx) => (
            <div key={idx} className="cert-box">
              {item.file ? (
                item.file.type.includes("image") ? (
                  <img src={item.url} alt={`Cert ${idx + 1}`} />
                ) : (
                  <span>{item.file.name}</span>
                )
              ) : null}
              <button
                type="button"
                className="cancel-btn"
                onClick={() => handleCertRemove(idx)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="nav-buttons">
          <button
            className="add-more btn-outline"
            onClick={twoStep}
            type="button"
          >
            Add more about my service
          </button>
          <button type="button" onClick={onBack} className="btn-outline">
            Back
          </button>
          <button type="submit" className="btn-submit">
            View Preview
          </button>
        </div>
      </form>
    </>
  );
};

export default StepThree;
