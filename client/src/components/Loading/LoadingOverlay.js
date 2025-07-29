// components/LoadingOverlay.js
import "./LoadingOverlay.css";

const LoadingOverlay = ({ message = "Creating your profile..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
