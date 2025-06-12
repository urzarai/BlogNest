import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BlogNest</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/blogs">BLOGS</Link>
        <Link to="/creators">CREATORS</Link>
        <Link to="/feedback">FEEDBACK</Link>
        <Link to="/contact">CONTACT US</Link>
      </div>
      <div>
        <Link to="/dashboard" className="navbar-dashboard-btn">Dashboard</Link>
        <Link to="/login" className="navbar-login-btn">Login</Link>
      </div>
    </nav>
  )
}
