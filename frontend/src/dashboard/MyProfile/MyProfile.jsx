import React from "react";
import { useAuth } from "../../context/AuthProvider";
import "./MyProfile.css";

function MyProfile() {
  const { profile } = useAuth();

  if (!profile?.user) {
    return <div className="myprofile-container">Loading profile...</div>;
  }

  const { name, email, phone, photo, education, role } = profile.user;

  return (
    <div className="myprofile-container">
      <h2>My Profile</h2>
      <div className="myprofile-details">
        <img src={photo?.url} alt={name} className="myprofile-avatar" />
        <div className="myprofile-info">
          <div><span className="myprofile-label">Name:</span> {name}</div>
          <div><span className="myprofile-label">Email:</span> {email}</div>
          <div><span className="myprofile-label">Phone:</span> {phone}</div>
          <div><span className="myprofile-label">Education:</span> {education}</div>
          <div><span className="myprofile-label">Role:</span> {role}</div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
