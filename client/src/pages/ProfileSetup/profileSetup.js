import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import profileSetup from "./profileSetup.css"; 
import { useNavigate } from "react-router-dom";
import {useUser} from "../../context/UserContext";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAMFBMVEXk5ueutLepsLPZ3N7n6erIzM7P0tTq7O2yuLvBxsje4eLV2NrR1da2u767wMPEycvljgLtAAADY0lEQVR4nO2byXLbMAxAuYDiou3//7akXLfxIosABciZ4bskMz3kDQiBC1ClOp1Op9PpdDqdTqfT6XR+DQDPv1wOeGUHF5dMjG6yX2EGaopaa6Nv5J8hWnWxGaR1vhv9x4ThWrGoX6VuXCcGbleqRGy8xAvSsut0I15hZQ+kcsDmJG41HVoVkuxCwrSfVQ9YSS8Y6qRKvAStxspYZYKcVwrVVlrPUsvoZ4SVNk7GC4b6JdwYRbSOC9YTQSJc/qi4v2AGfi+wyCXUMl8jOlgiWY/OrA1uLYj4Nczh4j7kAMVK64XZCrHt/IQ56YGQ8AUzsWop1L7zg8iaXLTvsOA5tYiplVeR0wocWctyakWiVc55xuTCnbQe4Nx/POZY+gjnp+ipqZXrfNfqWh+1vjTlv7NA0A6BBdZy+qWbT8NWzXuwIec868GGch3bgsV7DKQeIQzvOwTlTl3gvlcT6zxnjS/QSgT79ZV4yeD9DhUt6c3AbaVU+s6HJI/eF1n3w38kdLBE3nTRT7pCL/OwYLykHsAV7oFkYS8OdzBbkGBzRcFYrSXaG65+FRRt3NXGK4j30SF96J/fMItw8/XG0e4oVxkegOnjwIFwWv3wgjW8FzNBZB/cFUvuVcyYebp8ygZsnENW+Wukw+wuyfQXQNlxWMukVHTD+B2DUgXY8N5vP6+2UUXIg0o5WIPbGHK0bMqG132F+boxuvh6+y+TZcs62iQ+kQc+jW6ZjdmtW/mfstuQxMzyH7Ku/sC1jkqgWOR6sM77QXoXtxCZq1jO7oH2ksQ4xQh+3B8FPIzZwjMsCGp8MzOJIbjTxcBPqOvO+4jNZ4tZ4ivgM+HE1whIa3Ok7pjltGNY/TWnSuyUlQRFbhHsec3tAQO7c/5sovWUXz3IicO0DfDSezxHhBYtNqvsRU4waCzrnzHUE397Xf8MKV5Ab2nWQokXY17dwb99wXn7zScvZLioU21IsP081DB1ixdqUrahg4/1wiwh9uW9AcSMpdQSblQPM+K7Ok1Uv9uLWtVmPX3SjsZcFyvRzNK1TVDJz/DGXJNdDcNQREzN1kho+rayHic9OHGrqqQ/6f6MoeKAI/0dFiomcOgz3g1ax/dGmYPWE4eNY/qYXQuHlQsWcwWHBdVegcx/fut0Op1O5xfyBzfiKaWdaPkVAAAAAElFTkSuQmCC"
  );
  const [showDefaultImages, setShowDefaultImages] = useState(false);
  const fileInputRef = useRef(null);
  const {user,updateUser} = useUser();

  const defaultImages = [
    "https://picsum.photos/192?random=1",
    "https://picsum.photos/192?random=2",
    "https://picsum.photos/192?random=3",
    "https://picsum.photos/192?random=4",
    "https://picsum.photos/192?random=5",
    "https://picsum.photos/192?random=6",
    "https://picsum.photos/192?random=7",
    "https://picsum.photos/192?random=8",
  ];

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click using the ref
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle continue button click
  const handleContinue = () => {
    // console.log("Continue button clicked");
    // Add logic to proceed to the next step
  };

  // Handle continue without image click
  const handleContinueWithoutImage = () => {
    // console.log("Continue without image clicked");
    // Add logic to proceed without an image
  };
  // console.log("User data in ProfileSetup:", user);

  return (
    <div className="profile-setup-container">
      <button onClick={()=> navigate("/Consumer-Signup2")} className="back-button" aria-label="Go back">
        <ArrowLeft size={24} />
      </button>

      <div className="main-content">
        <h1 className="main-heading">Welcome! Let's create your profile</h1>
        <p className="sub-heading">Let others get to know you better!</p>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <h2 className="profile-heading">Add your profile picture</h2>
          <div className="profile-image-container">
            <img
              src={image}
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150"; // Fallback image
              }}
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="choose-image-btn"
              onClick={handleImageUploadClick}
              aria-label="Upload profile picture"
            >
              Choose Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <p className="default-image-text">
              Or{" "}
              <span
                className="default-image-link"
                onClick={() => setShowDefaultImages(true)}
              >
                choose one
              </span>{" "}
              of our defaults
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            type="button"
            className="continue-without-btn"
            onClick={handleContinueWithoutImage}
          >
            Continue Without Image
          </button>
          <button
            type="button"
            className="continue-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Default Image Gallery Overlay */}
      {showDefaultImages && (
        <div className="default-images-overlay">
          <div className="default-images-grid">
            {defaultImages.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setImage(img);
                  setShowDefaultImages(false);
                }}
                className="default-image-option"
              >
                <img
                  src={img}
                  alt={`Default ${index + 1}`}
                  className="default-image"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="close-gallery-btn"
            onClick={() => setShowDefaultImages(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup;
