import React from "react";
import "./Sidebar.css";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ isOpen, onClose, isAuthenticated, user }) => {
  const navigate = useNavigate();
  return (
    <div className={`sidebar-overlay ${isOpen ? "open" : ""}`}>
      <div className="sidebar">
        <AiOutlineClose className="close-icon" onClick={onClose} />

        {user ? (
          <div
            className="sidebar-user"
            onClick={() => {
              navigate("/profile/manage");
              onClose();
            }}
          >
            <img
              src={
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="User Avatar"
              className="sidebar-user-avatar"
            />
            <div className="sidebar-user-info">
              <h4>{user?.name || "User"}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
        ) : null}

        {/* ✅ Menu Items */}
        <ul className="sidebar-menu">
          <li>Support</li>
          <li>Notifications</li>
          <li>Language</li>

          {/* ✅ If NOT logged in, show Sign In / Sign Up */}
          {!isAuthenticated && (
            <>
              <li>Sign In</li>
              <li>Sign Up</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
