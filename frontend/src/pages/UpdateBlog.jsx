import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const CATEGORIES = [
  "Technology", "Science", "Health", "Lifestyle", "Travel",
  "Food", "Business", "Culture", "Sports", "Education", "Other",
];

export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [myBlogs, setMyBlogs]       = useState([]);
  const [form, setForm]             = useState({ title: "", category: "", about: "" });
  const [selectedId, setSelectedId] = useState(id || null);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  useEffect(() => {
    if (!id) {
      axiosInstance.get("/api/blogs/my-blogs")
        .then((res) => setMyBlogs(Array.isArray(res.data) ? res.data : []))
        .catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (!selectedId) return;
    setFetching(true);
    axiosInstance.get(`/api/blogs/single-blog/${selectedId}`)
      .then((res) => {
        const b = res.data.blogs;
        setForm({ title: b.title, category: b.category, about: b.about });
      })
      .catch(() => setError("Could not load blog data."))
      .finally(() => setFetching(false));
  }, [selectedId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedId) { setError("Please select a blog to update."); return; }
    if (form.about.length < 200) { setError("About must be at least 200 characters."); return; }
    setLoading(true);
    try {
      await axiosInstance.put(`/api/blogs/update/${selectedId}`, form);
      setSuccess("Blog updated successfully!");
      setTimeout(() => navigate("/my-blogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-page__header">
        <p className="section-eyebrow">Editing</p>
        <h1 className="section-title">Update Blog</h1>
        <p className="section-subtitle">Edit and republish one of your existing articles.</p>
      </div>

      {!id && (
        <div className="form-group" style={{ marginBottom: "2rem" }}>
          <label className="form-label">Select Blog to Edit</label>
          <select
            className="form-select"
            value={selectedId || ""}
            onChange={(e) => { setSelectedId(e.target.value); setForm({ title: "", category: "", about: "" }); }}
          >
            <option value="">— Choose a blog —</option>
            {myBlogs.map((b) => (
              <option key={b._id} value={b._id}>{b.title}</option>
            ))}
          </select>
        </div>
      )}

      {fetching && <div className="spinner-wrap"><div className="spinner" /></div>}

      {selectedId && !fetching && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Blog title..." required />
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
              placeholder="Blog content..."
              style={{ minHeight: 300 }}
              required
            />
          </div>

          {error   && <p className="form-error">{error}</p>}
          {success && <p style={{ color: "#1a6b3a", fontFamily: "var(--mono)", fontSize: "0.75rem" }}>{success}</p>}

          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes →"}
            </button>
            <button className="btn btn--outline" type="button" onClick={() => navigate("/my-blogs")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}