import React, { useState } from "react";
import StepOne from "../../verify/ServiceForm/StepOne";
import StepTwo from "../../verify/ServiceForm/StepTwo";
import StepThree from "../../verify/ServiceForm/StepThree";
import StepFour from "../../verify/ServiceForm/StepFour";
import AdditionalInfo from "../../verify/ServiceForm/AdditionalInfo";
import SuccessStep from "../../verify/ServiceForm/SuccessStep";
import axios from "axios";
import { toast } from "react-toastify";

const FormSteps = ({
  formData,
  setFormData,
  onStepChange,
  currentStep,
  setCurrentStep,
}) => {
  // const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // console.log("Current Step: ", currentStep);
    }
  };
  const twoStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 2);
      // console.log("Current Step: ", currentStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // After the simulated save
    setIsLoading(false);
    alert("Draft saved!");
  };

  const handlePostService = async () => {
    setIsLoading(true);
    const data = new FormData();
    if (formData.userId) {
      data.append("userId", formData.userId);
    } else {
      console.warn("⚠️ userId is missing in formData");
    }
    data.append("locationCovered",JSON.stringify(formData.locationCovered));
    // Append text fields
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("professionName", formData.professionName);
    data.append("company", formData.company);
    data.append("experience", formData.experience);
    data.append("services", formData.services);
    data.append("jobDescription", formData.jobDescription);
    // data.append("locationCovered", JSON.stringify(locations));
    // data.append("city", formData.city);
    // data.append("state", formData.state);
    data.append("email", formData.email);
    data.append("sameWhatsApp", formData.sameWhatsApp);
    data.append("availableWeekends", formData.availableWeekends);
    // Append array fields
    formData.mobileNumbers.forEach((num) => {
      if (num) data.append("mobileNumbers", num);
    });

    formData.whatsappNumbers.forEach((num) => {
      if (num) data.append("whatsappNumbers", num);
    });

    // Append files
    if (formData.image) data.append("image", formData.image);
    if (formData.aadhaar) data.append("aadhaar", formData.aadhaar);
    if (formData.quotationFile)
      data.append("quotationFile", formData.quotationFile);
    if (formData.pricingFile) data.append("pricingFile", formData.pricingFile);
    if (formData.termsFile) data.append("termsFile", formData.termsFile);
    if (formData.logoImg) data.append("logoImg", formData.logoImg);

    formData.certifications.forEach((file) => {
      data.append("certifications", file);
    });

    formData.workImages.forEach((file) => {
      data.append("workImages", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/post-service`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFormData(response.data.data);
        // console.log("data returned from server", response.data.data);
        setCurrentStep(5);
      }
    } catch (error) {
      toast.error(
        "Failed to post service. Please try again.",
        error?.response || error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Notify parent wrapper of step changes for progress bar update
  React.useEffect(() => {
    onStepChange(currentStep);
    if (currentStep === 5) {
      toast.success("Service posted successfully!");
    }
  }, [currentStep, onStepChange]);

  switch (currentStep) {
    case 0:
      return (
        <StepOne
          formData={formData}
          setFormData={setFormData}
          onNext={nextStep}
        />
      );
    case 1:
      return (
        <StepTwo
          formData={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          setCurrentStep={setCurrentStep}
        />
      );
    case 2:
      return (
        <StepThree
          formData={formData}
          setFormData={setFormData}
          onBack={prevStep}
          twoStep={twoStep}
          onPreview={nextStep}
        />
      );
    case 3:
      return (
        /* this is preview page */
        <StepFour
          formData={formData}
          onBack={prevStep}
          onSaveDraft={handleSaveDraft}
          onPost={handlePostService}
          isLoading={isLoading}
        />
      );
    case 4: // this is additional information step
      return (
        <AdditionalInfo
          formData={formData}
          onBack={() => setCurrentStep(currentStep - 2)}
          onNext={prevStep}
          setFormData={setFormData}
        />
      );
    case 5: //this will the final success page
      return <SuccessStep formData={formData} />;
    default:
      return null;
  }
};

export default FormSteps;
