import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]   = useState({ email: "", password: "", role: "User" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Banner */}
      <div className="auth-banner">
        <div className="auth-banner__logo">Blog<span>Nest</span></div>
        <p className="auth-banner__quote">"The scariest moment is always just before you start writing."</p>
        <p className="auth-banner__footer">— Stephen King</p>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <h1 className="auth-form-side__title">Welcome back.</h1>
        <p className="auth-form-side__subtitle">Sign in to your account to continue.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="form-group">
            <label className="form-label">Login as</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}