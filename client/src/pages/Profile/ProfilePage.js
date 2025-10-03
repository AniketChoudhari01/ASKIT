import React, { useState, useEffect } from "react";
import {
  Edit3,
  Plus,
  Star,
  CheckCircle,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  Save,
  X,
  Trash2,
} from "lucide-react";
import { FaMedal } from "react-icons/fa";
import "./ProfileManage.css";
import axios from "axios";
import ProfileCard from "../../components/ProfileManageCard/ProfileManageCard";
import { MdOutlineMail } from "react-icons/md";
import { useUser } from "../../context/UserContext";
import { MdCalendarViewMonth } from "react-icons/md";
import { IoIosEyeOff } from "react-icons/io";
import "./ProfilePage.css";
import { FaUsersViewfinder } from "react-icons/fa6";
import { BiImageAdd } from "react-icons/bi";
import { CiPhone } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

// Modular Edit Modal Component
const EditModal = ({
  isOpen,
  onClose,
  title,
  fieldType,
  currentValue,
  onSave,
  loading,
}) => {
  const [value, setValue] = useState(currentValue || "");
  const [arrayItems, setArrayItems] = useState([]);

  useEffect(() => {
    if (fieldType === "array" && Array.isArray(currentValue)) {
      setArrayItems(
        currentValue.map((item, index) => ({
          id: index,
          value:
            typeof item === "string"
              ? item
              : item.name || item.title || item.type || "",
        }))
      );
    } else {
      setValue(currentValue || "");
    }
  }, [currentValue, fieldType]);

  const handleArrayAdd = () => {
    setArrayItems([...arrayItems, { id: Date.now(), value: "" }]);
  };

  const handleArrayRemove = (id) => {
    setArrayItems(arrayItems.filter((item) => item.id !== id));
  };

  const handleArrayChange = (id, newValue) => {
    setArrayItems(
      arrayItems.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  const handleSave = () => {
    if (fieldType === "array") {
      const cleanItems = arrayItems.filter((item) => item.value.trim() !== "");
      onSave(cleanItems.map((item) => item.value));
    } else {
      onSave(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit {title}</h3>
          <X size={20} onClick={onClose} className="close-btn" />
        </div>

        <div className="edit-modal-content">
          {fieldType === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}...`}
              rows={4}
              className="edit-input"
            />
          ) : fieldType === "array" ? (
            <div className="array-editor">
              {arrayItems.map((item) => (
                <div key={item.id} className="array-item">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleArrayChange(item.id, e.target.value)}
                    placeholder={`Enter ${title.toLowerCase()}...`}
                    className="edit-input"
                  />
                  <Trash2
                    size={16}
                    onClick={() => handleArrayRemove(item.id)}
                    className="remove-btn"
                  />
                </div>
              ))}
              <button onClick={handleArrayAdd} className="add-array-item">
                <Plus size={16} /> Add {title}
              </button>
            </div>
          ) : fieldType === "boolean" ? (
            <div className="boolean-selector">
              <label>
                <input
                  type="radio"
                  name="boolean-choice"
                  checked={value === true}
                  onChange={() => setValue(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="boolean-choice"
                  checked={value === false}
                  onChange={() => setValue(false)}
                />
                No
              </label>
            </div>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}...`}
              className="edit-input"
            />
          )}
        </div>

        <div className="edit-modal-footer">
          <button onClick={onClose} className="edit-btns cancel-edit-btn">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="edit-btns save-edit-btn
          "
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ProfileSection component with edit functionality
const ProfileSection = ({
  title,
  isServiceProvider,
  onEdit,
  editField,
  children,
}) => {
  if (!isServiceProvider) {
    return (
      <div className="profile-section preview-mode">
        <div className="section-header">
          <h3 className="section-title">{title}</h3>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {onEdit && editField && (
          <Edit3
            size={20}
            className="section-edit"
            onClick={() => onEdit(editField)}
            title={`Edit ${title}`}
          />
        )}
      </div>
      {children}
    </div>
  );
};

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [userType, setUserType] = useState("service_seeker");

  // Edit modal states
  const [editModal, setEditModal] = useState({
    isOpen: false,
    field: null,
    title: "",
    type: "text",
    currentValue: null,
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      fetchProfileData();
    }
  }, [user]);

  // console.log("Profile Data: ", profileData);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      if (!user || !user._id) return;

      const userId = user._id;
      // console.log("Fetching profile for user:", userId);

      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/profile/${userId}`,
        { withCredentials: true }
      );

      if (res.status !== 200) throw new Error("Failed to fetch profile");

      const data = res.data;
      // console.log("Raw backend data:", data);

      // Extract provider data if exists
      const provider = data.provider || null;
      const isProvider = data.role === "service_provider" && provider;

      setProfileData({
        // Basic user info
        id: data.id || "",
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "service_seeker",
        profilePicture: data.profilePicture || "",

        // Service Provider specific data
        ...(provider && {
          professionName: provider.professionName || "",
          jobDescription: provider.jobDescription || "",
          location:
            provider.locationCovered?.name || provider.locationCovered || "",
          rating: provider.rating || 0,
          services: provider.services || "",
          availableWeekends: provider.availableWeekends || false,

          // Experience - handle different formats
          experience: provider.experience
            ? Array.isArray(provider.experience)
              ? provider.experience
              : [provider.experience]
            : [],

          // Certifications - convert URLs to objects if needed
          certifications: Array.isArray(provider.certifications)
            ? provider.certifications.map((cert, index) => ({
                id: index,
                title:
                  typeof cert === "string"
                    ? cert.split("/").pop() || `Certificate ${index + 1}`
                    : cert.title || `Certificate ${index + 1}`,
                status: cert.status || "Verified",
                url: typeof cert === "string" ? cert : cert.url,
              }))
            : [],

          // Work Images/Highlights
          workHighlights: Array.isArray(provider.workImages)
            ? provider.workImages
            : [],
        }),

        // Initialize empty arrays for missing data
        skills: [],
        languages: [],
        jobPreferences: {},
      });

      setUserType(data.role || "service_seeker");
      setIsServiceProvider(isProvider);
    } catch (err) {
      setError("Failed to load profile data");
      // console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Modular update function
  const updateProfileField = async (field, value) => {
    try {
      setUpdateLoading(true);

      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      const userId = user._id;

      // Prepare the payload based on field type
      const payload = {
        field,
        value,
        userId,
      };

      // console.log("Updating field:", payload);

      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/profile/update-field`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update local state
        setProfileData((prev) => ({
          ...prev,
          [field]: value,
        }));

        // Close modal
        setEditModal({
          isOpen: false,
          field: null,
          title: "",
          type: "text",
          currentValue: null,
        });

        // console.log("Profile updated successfully");
      }
    } catch (err) {
      // console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Open edit modal function
  const openEditModal = (field) => {
    const fieldConfigs = {
      // Basic fields
      name: { title: "Name", type: "text" },
      phone: { title: "Phone", type: "text" },

      // Service provider fields
      professionName: { title: "Profession Name", type: "text" },
      jobDescription: { title: "Job Description", type: "textarea" },
      services: { title: "Services", type: "textarea" },
      location: { title: "Location", type: "text" },
      availableWeekends: { title: "Weekend Availability", type: "boolean" },

      // Array fields
      experience: { title: "Experience", type: "array" },
      skills: { title: "Skills", type: "array" },
      languages: { title: "Languages", type: "array" },

      // Complex fields (for future implementation)
      certifications: { title: "Certifications", type: "array" },
      workHighlights: { title: "Work Highlights", type: "array" },
    };

    const config = fieldConfigs[field];
    if (!config) {
      // console.error("Field configuration not found:", field);
      return;
    }

    setEditModal({
      isOpen: true,
      field,
      title: config.title,
      type: config.type,
      currentValue: profileData?.[field],
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      field: null,
      title: "",
      type: "text",
      currentValue: null,
    });
  };

  const handleSaveEdit = (value) => {
    if (editModal.field) {
      updateProfileField(editModal.field, value);
    }
  };

  const onBecomeProvider = () => {
    const payload = {
      id: profileData?.id,
      name: profileData?.name,
      email: profileData?.email,
      phone: profileData?.phone,
      role: profileData?.role,
    };

    navigate("/signup/service-form", { state: payload });
  };

  const navigateToServiceProviderSetup = () => {
    alert("Redirecting to service provider setup form...");
    setUserType("service_provider");
  };

  if (loading) {
    return (
      <div className="service-provider-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-provider-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      className="profile-manage-container"
    >
      <div className="profile-left">
        <ProfileCard formData={profileData} userType={userType} />
        <div className="email-mobile-container">
          <div className="edits">
            <Edit3
              size={20}
              className="section-edit"
              onClick={() => openEditModal("phone")}
              title="Edit Phone"
            />
            <Plus size={20} className="section-edit" />
          </div>

          <div className="mobile-container">
            <span>
              <CiPhone className="btn-icon" />
              {profileData?.phone || "+91 1234567890"}
            </span>
          </div>
          <div className="email-container">
            <span>
              <MdOutlineMail className="btn-icon" />
              {profileData?.email || "example@gmail.com"}
            </span>
          </div>
        </div>
      </div>

      <div className="service-provider-container">
        {/* Navigation for service providers */}
        {isServiceProvider && (
          <div className="top-nav">
            <div className="left-nav">
              <button className="nav-btns">
                <span>
                  <BiImageAdd className="btn-icon" />
                  Add Story
                </span>
              </button>
              <button className="nav-btns">
                <span>
                  <BiImageAdd className="btn-icon" />
                  Add Post
                </span>
              </button>
              <button className="nav-btns">
                <span>
                  <MdCalendarViewMonth className="btn-icon" />
                  View Post
                </span>
              </button>
            </div>
            <div className="right-nav">
              <button className="nav-btns">
                <span>
                  <IoIosEyeOff
                    className="btn-icon"
                    style={{ backgroundColor: "#dc3838" }}
                  />
                  Hide my Services
                </span>
              </button>
              <button className="nav-btns">
                <span>
                  <FaUsersViewfinder className="btn-icon" />
                  Seekers view
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-details">
              <h1>{profileData?.name || "User Name"}</h1>
              <div className="profile-subtitle">
                {profileData?.location || "Location not specified"} |{" "}
                {isServiceProvider ? "Service Provider" : "Service Seeker"}
              </div>
              {isServiceProvider && profileData?.professionName && (
                <div className="profession">{profileData.professionName}</div>
              )}
              {isServiceProvider && profileData?.rating > 0 && (
                <div className="rating">
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  {profileData.rating.toFixed(1)}
                </div>
              )}
            </div>
          </div>

          <Edit3
            size={33}
            className="edit-icon"
            onClick={() =>
              !isServiceProvider
                ? navigateToServiceProviderSetup()
                : openEditModal("name")
            }
            title={!isServiceProvider ? "Become Service Provider" : "Edit Name"}
          />
        </div>

        <div className="profile-content">
          {/* Show overlay for non-service providers */}
          {!isServiceProvider && (
            <div className="preview-overlay">
              <div className="preview-content">
                <div className="preview-icon">
                  <Lock size={24} color="#6b7280" />
                </div>
                <div className="preview-title">Become a Service Provider</div>
                <div className="preview-description">
                  Complete your profile to start offering services and connect
                  with customers
                </div>
                <button
                  className="become-provider-btn"
                  onClick={onBecomeProvider}
                >
                  Get Started
                  <ArrowRight size={30} />
                </button>
              </div>
            </div>
          )}

          {/* Job Description Section */}
          {isServiceProvider && (
            <ProfileSection
              title="About My Services"
              isServiceProvider={isServiceProvider}
              onEdit={openEditModal}
              editField="jobDescription"
            >
              <div className="job-description">
                {profileData?.jobDescription ||
                  "No service description provided"}
              </div>
            </ProfileSection>
          )}

          {/* Experience Section */}
          <ProfileSection
            title="Experience"
            isServiceProvider={isServiceProvider}
            onEdit={openEditModal}
            editField="experience"
          >
            <div className="experience-container">
              {profileData?.experience && profileData.experience.length > 0 ? (
                profileData.experience.map((exp, index) => (
                  <div key={index} className="experience-badge">
                    <FaMedal className="btn-icon" />
                    <span>
                      {typeof exp === "string"
                        ? exp
                        : exp.type || exp.title || `Experience ${index + 1}`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="no-data">No experience added</div>
              )}
            </div>
          </ProfileSection>

          {/* Work Highlights */}
          <ProfileSection
            title="Work Highlights"
            isServiceProvider={isServiceProvider}
            onEdit={openEditModal}
            editField="workHighlights"
          >
            <div className="work-highlights">
              {isServiceProvider && (
                <button className="add-highlight">
                  <Plus size={20} color="#6b7280" />
                </button>
              )}
              {profileData?.workHighlights &&
              profileData.workHighlights.length > 0 ? (
                profileData.workHighlights.map((highlight, index) => (
                  <img
                    key={index}
                    src={highlight}
                    alt={`Work ${index + 1}`}
                    className="highlight-item"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ))
              ) : (
                <div className="no-data">No work highlights added</div>
              )}
              {profileData?.workHighlights &&
                profileData.workHighlights.length > 3 && (
                  <ChevronRight size={20} className="scroll-arrow" />
                )}
            </div>
          </ProfileSection>

          {/* Services Section */}
          {isServiceProvider && (
            <ProfileSection
              title="Services Offered"
              isServiceProvider={isServiceProvider}
              onEdit={openEditModal}
              editField="services"
            >
              <div className="services-container">
                {profileData?.services || "No services specified"}
              </div>
            </ProfileSection>
          )}

          {/* Availability */}
          {isServiceProvider && (
            <ProfileSection
              title="Availability"
              isServiceProvider={isServiceProvider}
              onEdit={openEditModal}
              editField="availableWeekends"
            >
              <div className="availability-info">
                <div className="availability-item">
                  <span>Weekend Availability:</span>
                  <span
                    className={
                      profileData?.availableWeekends
                        ? "available"
                        : "not-available"
                    }
                  >
                    {profileData?.availableWeekends
                      ? "Available"
                      : "Not Available"}
                  </span>
                </div>
              </div>
            </ProfileSection>
          )}

          {/* Skills */}
          <ProfileSection
            title="Skills"
            isServiceProvider={isServiceProvider}
            onEdit={openEditModal}
            editField="skills"
          >
            <div className="skills-container">
              {profileData?.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`skill-tag ${
                      skill.highlighted ? "highlighted" : ""
                    }`}
                  >
                    {typeof skill === "string"
                      ? skill
                      : skill.name || `Skill ${index + 1}`}
                  </span>
                ))
              ) : (
                <div className="no-data">No skills added</div>
              )}
            </div>
          </ProfileSection>

          {/* Certifications */}
          <ProfileSection
            title="Certifications"
            isServiceProvider={isServiceProvider}
            onEdit={openEditModal}
            editField="certifications"
          >
            <div className="certifications-grid">
              {profileData?.certifications &&
              profileData.certifications.length > 0 ? (
                profileData.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <div className="cert-title">{cert.title}</div>
                    <div className="cert-status">{cert.status}</div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-link"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-data">No certifications added</div>
              )}
            </div>
          </ProfileSection>

          {/* Languages */}
          <ProfileSection
            title="Languages"
            isServiceProvider={isServiceProvider}
            onEdit={openEditModal}
            editField="languages"
          >
            <div className="languages-grid">
              {profileData?.languages && profileData.languages.length > 0 ? (
                profileData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <div className="lang-name">
                      {typeof lang === "string"
                        ? lang
                        : lang.name || `Language ${index + 1}`}
                    </div>
                    <div className="lang-level">
                      {typeof lang === "object" && lang.level
                        ? lang.level
                        : "Not specified"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No languages added</div>
              )}
            </div>
          </ProfileSection>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        title={editModal.title}
        fieldType={editModal.type}
        currentValue={editModal.currentValue}
        onSave={handleSaveEdit}
        loading={updateLoading}
      />
    </div>
  );
};

export default ServiceProviderProfile;
