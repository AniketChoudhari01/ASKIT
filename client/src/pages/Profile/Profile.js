import React from "react";
import "./Profile.css";
import { IoLogOutOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { CiBookmarkMinus } from "react-icons/ci";
import { MdPersonAdd } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { useUser } from "../../context/UserContext";
function Profile() {
  const { user, loading, logout } = useUser();
  return (
    <div className="profile">
      <div className="profile-top">
        <div className="left">
          <img
            src={
              user.profilePicture ||
              "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
            }
            alt="profile"
          />
        </div>
        <div className="right">
          <h1>{user.name || "Name"}</h1>
          <p>{user.profession || "Profession"}</p>
          <p className="same">
            <IoLocationOutline className="btn-icon" />
            {user.addresses[0] || "User Address"}
          </p>
        </div>
      </div>

      <div className="profile-middle">
        <p className="same">Manage Your Ask IT Account</p>
        <ul className="profile-list">
          <li>
            <MdPersonAdd className="btn-icon" />
            Add Account
          </li>
          <li onClick={logout}>
            <IoLogOutOutline className="btn-icon" />
            Sign out
          </li>
        </ul>
        <ul className="profile-list-options">
          <li>
            <MdHistory className="btn-icon" />
            Search History
          </li>
          <li>
            <CiBookmarkMinus className="btn-icon" />
            Saves and Collection
          </li>
          <li>
            <IoIosHelpCircleOutline className="btn-icon" />
            Help
          </li>
        </ul>
      </div>

      <div className="profile-bottom">
        <ul>
          <li>Privacy Policy</li>
          <li>Terms and Conditions</li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
