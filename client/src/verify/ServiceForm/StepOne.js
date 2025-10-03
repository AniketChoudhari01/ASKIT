// StepOne.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Styles/StepOne.css";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";

// Zod schema
const schema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  professionName: z.string().min(3, "Profession is required"),
  company: z.string().optional(),
  experience: z.string().min(1, "Experience is required"),
  services: z.string().min(3, "At least one service is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  image: z
  .any({
    required_error: "Profile image is required"
  })
  .refine((file) => file !== undefined && file !== null, {
    message: "Profile image is required",
  })
  .refine((file) => file && file.size <= 2 * 1024 * 1024, {
    message: "Image must be under 2MB",
  })
});

const StepOne = ({ formData = {}, setFormData, onNext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    formData.image
      ? typeof formData.image === "string"
        ? formData.image
        : URL.createObjectURL(formData.image)
      : ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      professionName: formData.professionName || "",
      company: formData.company || "",
      experience: formData.experience || "",
      services: formData.services || "",
      jobDescription: formData.jobDescription || "",
      image: null,
    },
    mode: "onChange",
  });

  // Sync form values to parent formData on change
  React.useEffect(() => {
    const subscription = watch((values) => {
      setFormData((prev) => ({ ...prev, ...values }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);
  // console.log("one ", previewUrl);
  const handleImageChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];

    // Revoke previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    setTimeout(() => {
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setError("image", {
            type: "manual",
            message: "Image must be under 2MB",
          });
          setFormData((prev) => ({ ...prev, image: null }));
          setIsLoading(false);
          return;
        } else {
          clearErrors("image");
          const newUrl = URL.createObjectURL(file);
          setPreviewUrl(newUrl);
          setValue("image", file);
          setFormData((prev) => ({ ...prev, image: file }));
        }
      } else {
        setFormData((prev) => ({ ...prev, image: null }));
      }
      setIsLoading(false);
    }, 300);
  };
  

  const onSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-form">
      <h2>Enter your service details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">
            First Name <span className="required_span">*</span>
          </label>
          <input
            type="text"
            {...register("firstName")}
            className="input-field"
          />
          {errors.firstName && (
            <p className="error-text">{errors.firstName.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">
            Last Name <span className="required_span">*</span>
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="input-field"
          />
          {errors.lastName && (
            <p className="error-text">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="professionName">
          Profession name <span className="required_span">*</span>
        </label>
        <input
          type="text"
          {...register("professionName")}
          className="input-field"
        />
        {errors.professionName && (
          <p className="error-text">{errors.professionName.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="company">Enterprise of company name if any </label>
        <input type="text" {...register("company")} className="input-field" />
      </div>
      <div className="form-group">
        <label htmlFor="experience">
          Experience <span className="required_span">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., 3 years"
          {...register("experience")}
          className="input-field"
        />
        {errors.experience && (
          <p className="error-text">{errors.experience.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="services">
          Service you provide <span className="required_span">*</span>
        </label>
        <input
          type="text"
          placeholder="comma separated"
          {...register("services")}
          className="input-field"
        />
        {errors.services && (
          <p className="error-text">{errors.services.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="jobDescription">
          Job Description (Describe about your services){" "}
          <span className="required_span">*</span>
        </label>
        <textarea
          {...register("jobDescription")}
          className="textarea-field"
          rows={4}
        />
        {errors.jobDescription && (
          <p className="error-text">{errors.jobDescription.message}</p>
        )}
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="file">
          Upload your image (Max 2mb)
        </label>
        <label htmlFor="file" className="upload-button">
          <span>
            <FiUploadCloud className="btn-icon" />{" "}
          </span>
          <span>{isLoading ? "Uploading..." : "Upload here"}</span>
        </label>
        <input
          id="file"
          type="file"
          accept=".jpg,.jpeg,.JPG,.JPEG,.png,.webp,.bmp,image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        {errors?.image && <p className="error-text">{errors.image.message}</p>}
        {previewUrl && (
            <img src={previewUrl} alt="Preview" className="preview-image" />
        )}
      </div>
      <div className="nav-buttons">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-outline"
        >
          Back
        </button>
        <button type="submit" className="btn-submit">
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default StepOne;
