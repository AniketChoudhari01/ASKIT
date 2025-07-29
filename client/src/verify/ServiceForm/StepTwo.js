import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Styles/StepTwo.css";
import OTP from "../../signup/verify/otp";
import { MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";
import { IoAdd } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import LocationDropdown from "../../components/location_dropdown";
const phoneRegex = /^[6-9]\d{9}$/;
const schema = z.object({
  locationCovered: z.object({
    type: z.literal("Point"),
    name: z.string(),
    coordinates: z.array(z.number()).length(2),
  }),

  // locationCovered: z
  //   .array(
  //     z.object({
  //       name: z.string().min(1, "Location name is required"),
  //       coordinates: z
  //         .array(z.number())
  //         .length(2, "Coordinates must have [longitude, latitude]"),
  //     })
  //   )
  //   .min(1, "At least one location is required"), // city: z.string().min(1, "City is required"),
  // state: z.string().min(1, "State is required"),
  // mobileNumbers: z
  //   .array(z.string().regex(phoneRegex, "Valid mobile number is required"))
  //   .min(1, "At least one mobile number is required"),
  // whatsappNumbers: z
  //   .array(z.string().regex(phoneRegex, "Valid WhatsApp number is required"))
  //   .optional(),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  availableWeekends: z.boolean().optional(),
  aadhaar: z
    .any()
    .refine(
      (file) => file && file.size <= 2 * 1024 * 1024,
      "Aadhaar must be under 2MB"
    ),
});

const StepTwo = ({ formData, setFormData, onBack, onNext }) => {
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [aadhaarPreview, setAadhaarPreview] = useState(
    formData.aadhaar ? URL.createObjectURL(formData.aadhaar) : null
  );

  // const handleLocationSelect = (place) => {
  //   setValue("location", {
  //     type: "Point",
  //     coordinates: [place.lon, place.lat],
  //   });
  // };
  // const [selectedLocation, setSelectedLocation] = useState("");
  // const clearSearch = () => {
  //   setSearchQuery("");
  //   setSelectedLocation(""); // Clear the selected location in the parent
  //   // setSuggestions([]);
  // };
  // const [searchQuery, setSearchQuery] = useState(selectedLocation || ""); // Use selectedLocation as default
  // const [suggestions, setSuggestions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      locationCovered: formData.locationCovered || [
        { name: "", coordinates: [] },
      ],
      mobileNumbers: formData.mobileNumbers || [""],
      whatsappNumbers: formData.whatsappNumbers || [""],
      email: formData.email || "",
      availableWeekends: formData.availableWeekends || false,
      aadhaar: formData.aadhaar || null,
    },
    mode: "onChange",
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "locationCovered",
  // });
  // console.log("locations covered are $$ ", formData.locationCovered);
  // Sync form values to parent formData on change
  React.useEffect(() => {
    const subscription = watch((values) => {
      setFormData((prev) => ({ ...prev, ...values }));
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);
  // React.useEffect(() => {
  //   if (fields.length === 0) {
  //     append({ name: "", coordinates: [] });
  //   }
  // }, [fields, append]);

  // Helper for array fields
  const handleArrayChange = (e, field) => {
    const idx = parseInt(e.target.dataset.idx, 10);
    const value = e.target.value;
    const arr = [...(watch(field) || [""])];
    arr[idx] = value;
    setValue(field, arr, { shouldValidate: true });
  };

  const addArrayField = (field) => {
    setValue(field, [...(watch(field) || [""]), ""], { shouldValidate: true });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === "checkbox" ? checked : value, {
      shouldValidate: true,
    });
  };

  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];
    setValue("aadhaar", file, { shouldValidate: true });
    if (file && file.size <= 2 * 1024 * 1024) {
      setAadhaarPreview(URL.createObjectURL(file));
    }
  };

  const handleSameAsMobile = () => {
    setValue("whatsappNumbers", watch("mobileNumbers"), {
      shouldValidate: true,
    });
  };

  // const verifyOTP = async (mobile, otp) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_URL}/verify-otp`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ mobile, otp }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       toast.success("OTP verified successfully!");
  //       setIsMobileVerified(true);
  //       setShowOTP(false);
  //     } else {
  //       toast.error(data.message || "OTP verification failed");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while verifying OTP.");
  //   }
  // };
  //------------------ for now only mimicing
  const verifyOTP = (mobile, otp) => {
    // For now, just mimic verification success
    if (otp && otp.length === 6) {
      toast.success("OTP verified successfully! (Mock)");
      setIsMobileVerified(true);
      setShowOTP(false);
    } else {
      toast.error("Invalid OTP format");
    }
  };

  const handleOTPChange = (enteredOTP) => {
    setOTP(enteredOTP);
    if (enteredOTP.length === 6) {
      verifyOTP(watch("mobileNumbers")?.[0], enteredOTP);
    }
  };

  const sendOTP = async (mobile) => {
    try {//mimic for now
      // const response = await fetch(
      //   `${process.env.REACT_APP_SERVER_URL}/send-otp`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ phone: mobile }),
      //   }
      // );
      // const data = await response.json();
      // if (response.ok) {
        toast.success("OTP sent successfully!");
        setShowOTP(true);
      // } else {
        // toast.error(data.message || "Failed to send OTP");
      // }
    } catch (error) {
      toast.error("An error occurred while sending OTP.");
    }
  };

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      locationCovered: data.locationCovered, // ✅ ensure explicitly set
    }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-two-form">
      <h2>Enter location details</h2>
      <div className="address-div">
        <label>
          Enter locations where you want to serve{" "}
          <span className="required_span">*</span>
        </label>

        {/* {fields.map((field, index) => ( */}
        <div className="location-input-group">
          <LocationDropdown
            defaultLocation={formData.locationCovered?.[0]?.name || ""}
            onLocationSelect={(loc) => {
              if (loc) {
                const geoObj = {
                  type: "Point",
                  coordinates: loc.coordinates, // must be [lng, lat]
                  name: loc.name,
                };

                setValue("locationCovered", geoObj, { shouldValidate: true });

                setFormData((prev) => ({
                  ...prev,
                  locationCovered: geoObj,
                }));
              }
            }}
          />
        </div>
        {/* ))} */}

        {/* <button
          type="button"
          onClick={() => append({ name: "", coordinates: [] })}
          className="add-btn"
        >
          + Add Location
        </button> */}

        {errors.locationCovered && (
          <p className="error required_span">
            {errors.locationCovered.message}
          </p>
        )}
      </div>
      {/* <div className="form-group">
        <label htmlFor="city">
          City <span className="required_span">*</span>
        </label>
        <input
          type="text"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          className="input"
        />
        {errors.city && <p className="error-text">{errors.city}</p>}
      </div> */}
      {/* <div className="form-group">
        <label htmlFor="state">
          State <span className="required_span">*</span>
        </label>
        <input
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          className="input"
        />
        {errors.state && <p className="error-text">{errors.state}</p>}
      </div> */}
      <h2>Add your contact details</h2>
      <label className="label">
        Mobile Numbers<span className="required_span">*</span>
      </label>
      {(watch("mobileNumbers") || [""]).map((num, idx) => (
        <div key={idx} className="input-verify input-verify-width">
          <input
            type="text"
            name={`mobileNumbers.${idx}`}
            data-idx={idx}
            value={num}
            placeholder="10 digit mobile number"
            className="verify-phone-input"
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            onInput={(e) => {
              e.target.value = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 10);
            }}
            onChange={(e) => handleArrayChange(e, "mobileNumbers")}
            required={idx === 0}
            disabled={isMobileVerified && idx === 0}
          />

          {/* Show "Verify now" ONLY for first number */}
          {idx === 0 && (
            <button
              id="verify-img"
              type="button"
              onClick={() => {
                setShowOTP(true);
                sendOTP(num);
              }}
              disabled={isMobileVerified || !num.trim()}
              style={{
                opacity: !num.trim() || isMobileVerified ? 0.5 : 1,
                cursor:
                  !num.trim() || isMobileVerified ? "not-allowed" : "pointer",
              }}
              title="Enter a valid mobile number to verify."
            >
              <MdCheckCircle className="btn-icon" />
              Verify now
            </button>
          )}
        </div>
      ))}
      {errors.mobileNumbers && (
        <p className="error-text">{errors.mobileNumbers.message}</p>
      )}
      {/* ➕ Add another number option only after the default one */}
      {isMobileVerified && (
        <div className="add-btn-width">
          <button
            type="button"
            onClick={() => addArrayField("mobileNumbers")}
            className="add-mobile-btn add-btn"
          >
            + Add another number
          </button>
        </div>
      )}
      {showOTP && (
        <div className="form2-popup-overlay">
          <OTP
            phoneNumber={watch("mobileNumbers")?.[0] || ""}
            onOTPChange={handleOTPChange}
            onClose={() => setShowOTP(false)}
          />
        </div>
      )}
      <label className="label">
        WhatsApp Number<span className="required_span">*</span>
      </label>
      {(watch("whatsappNumbers") || [""]).map((num, idx) => (
        <div key={idx}>
          <input
            type="text"
            name={`whatsappNumbers.${idx}`}
            data-idx={idx}
            value={num}
            placeholder={`WhatsApp ${idx + 1}`}
            className="input mt-2"
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            onInput={(e) => {
              e.target.value = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 10);
            }}
            onChange={(e) => handleArrayChange(e, "whatsappNumbers")}
          />
        </div>
      ))}
      {isMobileVerified && (
        <div className="whatsapp-options add-btn-width">
          <span>
            <input
              type="radio"
              onClick={handleSameAsMobile}
              id="same-as-mobile"
            />
            <label htmlFor="same-as-mobile">Same as Mobile Number</label>
          </span>
          <span>
            <button
              type="button"
              onClick={() => addArrayField("whatsappNumbers")}
              className="add-btn"
            >
              + Add WhatsApp number
            </button>
          </span>
        </div>
      )}
      <div className="email-container">
        <label htmlFor="email" className="label ">
          E mail Address<span className="required_span">*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Email Address"
          className="input"
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>
      <label className="checkbox-wrapper">
        <input type="checkbox" {...register("availableWeekends")} />
        <span>Available on weekends</span>
      </label>
      <div className="form-group">
        <label className="label">
          Add Aadhaar - A Step Closer (Max 2MB){" "}
          <span className="required_span">*</span>
        </label>
        <label htmlFor="aadhaar-file" className="upload-button">
          <span>
            <IoAdd className="btn-icon" />{" "}
          </span>
          <span>Add your aadhaar here</span>
        </label>
        <input
          id="aadhaar-file"
          type="file"
          accept="image/*"
          onChange={handleAadhaarChange}
          style={{ display: "none" }}
        />
        {errors.aadhaar && (
          <p className="error-text">{errors.aadhaar.message}</p>
        )}
        {aadhaarPreview && (
          <img
            src={aadhaarPreview}
            alt="Aadhaar Preview"
            className="aadhaar-preview"
          />
        )}
      </div>
      <div className="nav-buttons">
        <button type="button" onClick={onBack} className="btn-outline">
          Back
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={!isMobileVerified}
          title="Please verify your mobile number to continue"
          onClick={onNext}
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default StepTwo;
