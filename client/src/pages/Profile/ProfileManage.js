import React, { useState } from "react";
import ProfileCard from "../../components/ProfileManageCard/ProfileManageCard";
import "./ProfileManage.css";
import { BiImageAdd } from "react-icons/bi";
import { MdCalendarViewMonth } from "react-icons/md";
import { IoIosEyeOff } from "react-icons/io";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { useEffect } from "react";
import { FaUsersViewfinder } from "react-icons/fa6";
import WorkHighlights from "../../components/WorkHighlights/workHighlights";
function ProfileManage() {
  const { user, isAuthenticated } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isServiceProvider = user?.role === "serviceProvider";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 🔗 Replace with your actual endpoint
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/profile/${user._id}`
        );
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, user]);
  return (
    <div className="manage-wrapper">
      <div className="left-section">
        <ProfileCard /* {formData} */ />
      </div>
      <div className="right-section">
        {/*  <div className="top-nav">
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
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="profile-name">
              Kathir <span className="verified-badge">✔</span>
            </h2>
            <p className="profile-title">
              Carpenter |{" "}
              <span className="profile-location">
                @Gandhipuram, Coimbatore.
              </span>
            </p>
          </div>

          <div className="profile-summary">
            <h4>Profile summary</h4>
            <p>
              I provide quality woodworking and carpentry services, from custom
              furniture and cabinets to detailed woodwork. Whether it’s a small
              repair or a big project, I ensure a perfect finish every time. I
              work with both homes and businesses, delivering on time and within
              budget. Let’s bring your ideas to life with woodwork that fits
              your style.
            </p>
          </div>

          <div className="profile-badges">
            <div className="badge">
              <div className="badge-icon green">
                <span>3 Years</span>
              </div>
              <p className="badge-label">Experience</p>
            </div>
            <div className="badge">
              <div className="badge-icon green">
                <span>Available on weekends</span>
              </div>
              <p className="badge-label">Saturday/Sunday</p>
            </div>
          </div>
        </div>
        <WorkHighlights /> */}
        {/* <div className="profile-container">
          <div className="profile-header">
            <img
              src={profileData?.avatar || "/default-avatar.png"}
              alt="avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2>{profileData?.name || "Unnamed User"}</h2>
              {isServiceProvider ? (
                <span className="badge verified">
                  Verified Service Provider
                </span>
              ) : (
                <span className="badge normal">Client</span>
              )}
            </div> */}
        {/* </div> */}

        {/* Profile Summary */}
        {/*  <section className="profile-summary">
            <h3>Profile Summary</h3>
            {isServiceProvider ? (
              <p>{profileData?.summary}</p>
            ) : (
              <div className="empty-section">
                No service details yet.{" "}
                <button
                  onClick={() => (window.location.href = "/post-service")}
                >
                  Become a Service Provider
                </button>
              </div>
            )}
          </section> */}

        {/* Work Highlights */}
        {/*  <section className="work-highlights">
            <h3>Work Highlights</h3>
            {isServiceProvider && profileData?.workHighlights?.length > 0 ? (
              <div className="highlights-grid">
                {profileData.workHighlights.map((item, i) => (
                  <img key={i} src={item.image} alt={item.title} />
                ))}
              </div>
            ) : (
              <div className="placeholder">No work highlights added</div>
            )}
          </section> */}

        {/* Skills */}
        {/* <section className="skills-section">
            <h3>Skills</h3>
            {isServiceProvider && profileData?.skills?.length > 0 ? (
              <ul className="skills-list">
                {profileData.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <div className="placeholder">No skills listed yet</div>
            )}
          </section> */}

        {/* Certifications */}
        {/*   <section className="certifications">
            <h3>Certifications</h3>
            {isServiceProvider && profileData?.certifications?.length > 0 ? (
              <ul>
                {profileData.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            ) : (
              <div className="placeholder">No certifications provided</div>
            )}
          </section> */}

        {/* Job Suggestions (Visible only for service providers) */}
        {/* {isServiceProvider && (
            <section className="job-suggestions">
              <h3>Job Suggestions</h3>
              {profileData?.jobSuggestions?.length > 0 ? (
                profileData.jobSuggestions.map((job, i) => (
                  <div key={i} className="job-card">
                    <h4>{job.title}</h4>
                    <p>{job.location}</p>
                  </div>
                ))
              ) : (
                <div className="placeholder">
                  No job suggestions at the moment
                </div>
              )}
            </section>
          )} */}
        <div className="profile-container">
          <div className="profile-header">
            <img
              src={profileData?.avatar || "/default-avatar.png"}
              alt="avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2>{profileData?.name || "Unnamed User"}</h2>
              {isServiceProvider ? (
                <span className="badge verified">
                  Verified Service Provider
                </span>
              ) : (
                <span className="badge normal">Client</span>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <section className="profile-summary">
            <h3>Profile Summary</h3>
            {isServiceProvider ? (
              <p>{profileData?.summary}</p>
            ) : (
              <div className="empty-section">
                <p>
                  Your profile is currently a client profile. Upload your
                  service to go live!
                </p>
                <button
                  className="action-btn"
                  onClick={() => (window.location.href = "/post-service")}
                >
                  Upload Your Service
                </button>
              </div>
            )}
          </section>

          {/* Gray Placeholder UI for Non-Service Providers */}
          {!isServiceProvider && (
            <div className="placeholder-cards">
              <div className="gray-card">
                Work Highlights (Add by uploading service)
              </div>
              <div className="gray-card">Skills (Add by uploading service)</div>
              <div className="gray-card">
                Certifications (Add by uploading service)
              </div>
            </div>
          )}

          {/* Work Highlights */}
          {isServiceProvider && (
            <section className="work-highlights">
              <h3>Work Highlights</h3>
              {profileData?.workHighlights?.length ? (
                <div className="highlights-grid">
                  {profileData.workHighlights.map((item, i) => (
                    <img key={i} src={item.image} alt={item.title} />
                  ))}
                </div>
              ) : (
                <div className="placeholder">No work highlights added</div>
              )}
            </section>
          )}

          {/* Skills */}
          {isServiceProvider && (
            <section className="skills-section">
              <h3>Skills</h3>
              {profileData?.skills?.length ? (
                <ul>
                  {profileData.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <div className="placeholder">No skills listed</div>
              )}
            </section>
          )}

          {/* Certifications */}
          {isServiceProvider && (
            <section className="certifications">
              <h3>Certifications</h3>
              {profileData?.certifications?.length ? (
                <ul>
                  {profileData.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <div className="placeholder">No certifications yet</div>
              )}
            </section>
          )}

          {/* Job Suggestions */}
          {isServiceProvider && (
            <section className="job-suggestions">
              <h3>Job Suggestions</h3>
              {profileData?.jobSuggestions?.length ? (
                profileData.jobSuggestions.map((job, i) => (
                  <div key={i} className="job-card">
                    <h4>{job.title}</h4>
                    <p>{job.location}</p>
                  </div>
                ))
              ) : (
                <div className="placeholder">No job suggestions</div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileManage;
