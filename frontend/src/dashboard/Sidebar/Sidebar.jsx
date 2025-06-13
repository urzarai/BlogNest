import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Sidebar.css";

function Sidebar() {
  const { profile, setIsAuthenticated, setProfile } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    setProfile(null);
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <img
          src={profile?.user?.photo?.url}
          alt="Profile"
          className="sidebar-avatar"
        />
        <div className="sidebar-username">{profile?.user?.name || "User"}</div>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard/myblogs" className="sidebar-btn green">MY BLOGS</Link>
        <Link to="/dashboard/createblog" className="sidebar-btn blue">CREATE BLOG</Link>
        <Link to="/dashboard/myprofile" className="sidebar-btn purple">MY PROFILE</Link>
        <Link to="/" className="sidebar-btn red">HOME</Link>
        <button className="sidebar-btn yellow" onClick={handleLogout}>LOGOUT</button>
      </nav>
    </aside>
  );
}

export default Sidebar;