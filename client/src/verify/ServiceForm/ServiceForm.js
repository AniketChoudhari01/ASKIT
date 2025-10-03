import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CarpenterCard from "../../components/ServiceFormComp/ProfileCard";
import ProgressSteps from "../../components/ServiceFormComp/ProgressBar";
import FormSteps from "../../components/ServiceFormComp/FormSteps";
import "./Styles/ServiceForm.css";

const MultiStepFormPage = () => {
  const location = useLocation();
  const payload = location.state;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: payload?.name?.split(" ")[0] || "",
    lastName: payload?.name?.split(" ")[1] || "",
    email: payload?.email || "",
    userId: payload?.id || "",
    professionName: "",
    company: "",
    experience: "",
    services: "",
    jobDescription: "",
    image: null,
    locationCovered: {
      type: "Point",
      coordinates: [],
    },
    city: "",
    state: "",
    mobileNumbers: [""],
    whatsappNumbers: [""],
    sameWhatsApp: false,
    availableWeekends: false,
    aadhaar: null,
    quotationFile: null,
    quotationUrl: "",
    certifications: [],
    certificationUrls: [],
    pricingFile: null,
    termsFile: null,
    termsUrl: "",
    logoImg: null,
    workImages: [],
    workImageUrls: [],
  });

  useEffect(() => {
    // console.log("Received Payload:", payload);
    //FIX ME:
    // try {

    // } catch (error) {

    // }
    // Optional: If no payload, you can trigger a fallback API call here.
  }, [payload]);

  const handleStepChange = (step) => setCurrentStep(step);

  return (
    <>
      {currentStep !== 5 ? (
        <div className="formpage-container">
          <ProgressSteps currentStep={currentStep} />
          <div className="formpage-content">
            <div className="formpage-profile">
              <CarpenterCard {...formData} />
            </div>
            <div className="formpage-form">
              <div className="formpage-form-inner">
                <FormSteps
                  formData={formData}
                  setFormData={setFormData}
                  onStepChange={handleStepChange}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="formpage-form-inner">
          <FormSteps
            formData={formData}
            setFormData={setFormData}
            onStepChange={handleStepChange}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      )}
    </>
  );
};

export default MultiStepFormPage;
