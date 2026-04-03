import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const CATEGORIES = [
  "Technology", "Science", "Health", "Lifestyle", "Travel",
  "Food", "Business", "Culture", "Sports", "Education", "Other",
];

export default function CreateBlog() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ title: "", category: "", about: "" });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!image) { setError("Cover image is required."); return; }
    if (form.about.length < 200) { setError("About must be at least 200 characters."); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("about", form.about);
      fd.append("blogImage", image);

      await axiosInstance.post("/api/blogs/create", fd);
      setSuccess("Blog published successfully!");
      setTimeout(() => navigate("/my-blogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-page__header">
        <p className="section-eyebrow">Publishing</p>
        <h1 className="section-title">Create New Blog</h1>
        <p className="section-subtitle">Write something worth reading. About field must be at least 200 characters.</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {/* Cover image */}
        <div className="form-group">
          <label className="form-label">Cover Image</label>
          <label className="file-upload" style={{ cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
            {preview ? (
              <img src={preview} alt="Preview" className="file-preview" />
            ) : (
              <>
                <div className="file-upload__icon">🖼</div>
                <p className="file-upload__text">Click to upload cover image</p>
                <p className="file-upload__hint">JPG, PNG, WEBP — recommended 1200×630px</p>
              </>
            )}
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="An interesting title..." required />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Content (About)
            <span style={{ marginLeft: "0.5rem", color: form.about.length < 200 ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--mono)", fontSize: "0.6rem" }}>
              {form.about.length} / 200 min
            </span>
          </label>
          <textarea
            className="form-textarea"
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            style={{ minHeight: 300 }}
            required
          />
        </div>

        {error   && <p className="form-error">{error}</p>}
        {success && <p style={{ color: "#1a6b3a", fontFamily: "var(--mono)", fontSize: "0.75rem" }}>{success}</p>}

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog →"}
          </button>
          <button className="btn btn--outline" type="button" onClick={() => navigate("/my-blogs")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}