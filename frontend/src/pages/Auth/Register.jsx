import axios from "axios";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.jsx";
import "./Register.css";

function Register() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  // Default form state
  const defaultState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    education: "",
    photo: "",
    photoPreview: "",
  };

  const [form, setForm] = useState(defaultState);
  const fileInputRef = useRef(null);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        photoPreview: reader.result,
        photo: file,
      }));
    };
  };

  const resetForm = () => {
    setForm(defaultState);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("education", form.education);
    formData.append("photo", form.photo);

    try {
      const { data } = await axios.post(
        "https://blognest-gvv7.onrender.com/api/users/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("jwt", data.token);
      toast.success(data.message || "User registered successfully");
      setProfile(data);
      setIsAuthenticated(true);
      resetForm();
      navigateTo("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Please fill the required fields"
      );
      resetForm();
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="auth-form">
          <form onSubmit={handleRegister}>
            <div className="logo-title">BlogNest</div>
            <h1 className="form-title">Register</h1>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="form-select"
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email Address"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Your Phone Number"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Your Password (Minimum 8 characters)"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="form-input"
              />
            </div>
            <select
              value={form.education}
              onChange={(e) => setForm((prev) => ({ ...prev, education: e.target.value }))}
              className="form-select"
            >
              <option value="">Select Your Education</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="M.Sc">M.Sc</option>
              <option value="B.Com">B.Com</option>
              <option value="M.Com">M.Com</option>
              <option value="B.A">B.A</option>
              <option value="M.A">M.A</option>
              <option value="B.Ed">B.Ed</option>
              <option value="M.Ed">M.Ed</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>
            <div className="form-photo-row">
              <div className="photo-preview">
                <img
                  src={form.photoPreview ? form.photoPreview : "photo"}
                  className="photo-img"
                  alt="Preview"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="form-input-file"
                ref={fileInputRef}
              />
            </div>
            <p className="form-footer">
              Already registered?{" "}
              <Link to="/login" className="login-button">
                Login Now
              </Link>
            </p>
            <button type="submit" className="form-submit-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
