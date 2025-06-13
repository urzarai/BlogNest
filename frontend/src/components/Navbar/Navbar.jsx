import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider.jsx'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    navigate('/login')
    window.location.reload()
  }

  const userRole = profile?.user?.role

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BlogNest</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/blogs">BLOGS</Link>
        <Link to="/creators">CREATORS</Link>
        {isAuthenticated && (
          <>
            <Link to="/feedback">FEEDBACK</Link>
            <Link to="/contact">CONTACT US</Link>
          </>
        )}
      </div>

      <div className="navbar-auth-section">
        {!isAuthenticated && (
          <Link to="/login" className="navbar-login-btn">
            Login
          </Link>
        )}

        {isAuthenticated && userRole === 'Admin' && (
          <Link to="/dashboard" className="navbar-dashboard-btn">
            Dashboard
          </Link>
        )}

        {isAuthenticated && userRole === 'User' && (
          <button onClick={handleLogout} className="navbar-logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
