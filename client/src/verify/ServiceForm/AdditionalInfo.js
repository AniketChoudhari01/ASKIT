import React, { useState, useRef } from "react";
import "./Styles/StepThree.css";
import { FiUploadCloud } from "react-icons/fi";

const AdditionalInfo = ({ formData, setFormData, onBack, onNext }) => {
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const workInputRef = useRef(null);
  const [termsPreviewUrl, setTermsPreviewUrl] = useState(
    formData.termsFile ? URL.createObjectURL(formData.termsFile) : ""
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(
    formData.logoImg ? URL.createObjectURL(formData.logoImg) : ""
  );
  const [workPreviews, setWorkPreviews] = useState(
    (formData.workImages || []).map((file) => URL.createObjectURL(file))
  );
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFile = (file) => {
    setUploading(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        termsFile: file,
        termsUrl: file.name,
      });
      setTermsPreviewUrl(URL.createObjectURL(file));
      setUploading(false);
    }, 500);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setLogoPreviewUrl(URL.createObjectURL(file));
      setFormData({ ...formData, logoImg: file });
    }
  };

  const handleWorkImgChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    const updatedFiles = [...(formData.workImages || []), ...validFiles];
    setWorkPreviews([...(workPreviews || []), ...newPreviews]);
    setFormData({
      ...formData,
      workImages: updatedFiles,
      workImageUrls: updatedFiles.map((f) => f.name),
    });
  };

  const handleCancelUpload = () => {
    setFormData({ ...formData, termsFile: null, termsUrl: "" });
    setTermsPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleWorkImgRemove = (idx) => {
    const updatedFiles = [...(formData.workImages || [])];
    updatedFiles.splice(idx, 1);
    const updatedPreviews = [...(workPreviews || [])];
    updatedPreviews.splice(idx, 1);
    setWorkPreviews(updatedPreviews);
    setFormData({
      ...formData,
      workImages: updatedFiles,
      workImageUrls: updatedFiles.map((f) => f.name),
    });
    if (workInputRef.current) workInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    // Add validation if needed
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={onSubmit} className="step-three-form">
      <div className="form-group">
        <h2>Additional Information</h2>
        <h3>Terms and condition</h3>
        <p>upload your terms and condition if any</p>
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
          id="terms-file"
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          style={{ display: "none" }}
        />
        {errors?.terms && <p style={{ color: "red" }}>{errors.terms}</p>}
        {formData.termsFile && !uploading && !errors?.quotation && (
          <p style={{ marginTop: "0.5rem" }}>
            {formData.termsFile.name}
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
        <h3>Upload your logo</h3>
        <label className="form-label" htmlFor="logo-file">
          PNG/JPG up to 2MB, required for businesses
        </label>
        <label htmlFor="logo-file" className="upload-button">
          <span>
            <FiUploadCloud className="btn-icon" />{" "}
          </span>
          <span>Upload here</span>
        </label>
        <input
          id="logo-file"
          type="file"
          accept="image/*"
          ref={logoInputRef}
          onChange={handleLogoChange}
          style={{ display: "none" }}
        />
        {logoPreviewUrl && (
          <img
            src={logoPreviewUrl}
            alt="Logo Preview"
            className="preview-image"
          />
        )}
      </div>
      <div className="form-group">
        <h3>Showcase your work</h3>
        <label className="form-label" htmlFor="work-file">
          Add images of your previous work to attract more seekers
        </label>
        <label htmlFor="work-file" className="upload-button">
          <span>
            <FiUploadCloud className="btn-icon" />{" "}
          </span>
          <span>Upload here</span>
        </label>
        <input
          id="work-file"
          type="file"
          accept="image/*"
          ref={workInputRef}
          multiple
          onChange={handleWorkImgChange}
          style={{ display: "none" }}
        />
        <div className="work-previews">
          {workPreviews.map((url, idx) => (
            <div key={idx} className="work-img-box">
              <img
                src={url}
                alt={`Work ${idx + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                className="cancel-btn"
                onClick={() => handleWorkImgRemove(idx)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="nav-buttons">
        <button type="button" onClick={onBack} className="btn-outline">
          Back
        </button>
        <button type="submit" className="btn-submit">
          Save and continue
        </button>
      </div>
    </form>
  );
};

export default AdditionalInfo;
