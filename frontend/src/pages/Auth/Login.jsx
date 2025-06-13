import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.jsx";
import "./Login.css";

function Login() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/users/login",
        { email, password, role },
        { withCredentials: true }
      );
      localStorage.setItem("jwt", data.token);
      setProfile(data);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setRole("");
      navigateTo("/");
      alert(data.message || "Login successful"); 
    } catch (error) {
      setEmail("");
      setPassword("");
      setRole("");
      navigateTo("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <div className="logo-title">BlogNest</div>
        <h2 className="form-title">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" className="form-submit-btn">
            Login
          </button>
        </form>
        
        <p className="auth-footer">
          New user?{" "}
          <Link to="/register" className="register-button">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
