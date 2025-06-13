import React from 'react'
import { Outlet } from "react-router-dom";
import { useAuth } from '../../context/AuthProvider'
import Sidebar from "../../dashboard/Sidebar/Sidebar";
import MyBlogs from "../../dashboard/MyBlogs/MyBlogs";
import "./Dashboard.css";

function Dashboard() {
  const {profile, isAuthenticated} = useAuth();
  console.log(profile);
  console.log(isAuthenticated);
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard
