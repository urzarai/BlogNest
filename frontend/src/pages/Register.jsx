import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", education: "", role: "User" });
  const [photo, setPhoto]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!photo) { setError("Profile photo is required."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("photo", photo);
      await register(fd);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Banner */}
      <div className="auth-banner">
        <div className="auth-banner__logo">Blog<span>Nest</span></div>
        <p className="auth-banner__quote">"There is no greater agony than bearing an untold story inside you."</p>
        <p className="auth-banner__footer">— Maya Angelou</p>
      </div>

      {/* Form side */}
      <div className="auth-form-side" style={{ overflowY: "auto" }}>
        <h1 className="auth-form-side__title">Create account.</h1>
        <p className="auth-form-side__subtitle">Join BlogNest as a reader or a writer.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required />
          </div>

          <div className="form-group">
            <label className="form-label">Education</label>
            <input className="form-input" name="education" value={form.education} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" required />
          </div>

          <div className="form-group">
            <label className="form-label">Register as</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="User">User (Reader)</option>
              <option value="Admin">Admin (Writer)</option>
            </select>
          </div>

          {/* Photo upload */}
          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <label className="file-upload" style={{ cursor: "pointer" }}>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              {preview ? (
                <img src={preview} alt="Preview" className="file-preview" />
              ) : (
                <>
                  <div className="file-upload__icon">📷</div>
                  <p className="file-upload__text">Click to upload photo</p>
                  <p className="file-upload__hint">JPG, PNG, WEBP supported</p>
                </>
              )}
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}