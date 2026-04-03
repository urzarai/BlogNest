import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function MyBlogs() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // id being deleted
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const fetchBlogs = () => {
    setLoading(true);
    axiosInstance.get("/api/blogs/my-blogs")
      .then((res) => setBlogs(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Failed to load your blogs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await axiosInstance.delete(`/api/blogs/delete/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      setError("Failed to delete blog.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="my-blogs-page">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "0.5px solid var(--border)", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="section-title">My Blogs</h1>
          <p className="section-subtitle">Manage and edit all your published articles.</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/create-blog")}>
          + New Blog
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✍️</div>
          <p className="empty-state__title">No blogs published yet</p>
          <p className="empty-state__desc">Start writing your first article.</p>
          <button className="btn btn--primary mt-3" onClick={() => navigate("/create-blog")}>
            Create your first blog →
          </button>
        </div>
      ) : (
        <div>
          {blogs.map((blog) => (
            <div key={blog._id} className="my-blog-item">
              <img src={blog.blogImage?.url} alt={blog.title} className="my-blog-item__image" />

              <div>
                <h3 className="my-blog-item__title">{blog.title}</h3>
                <p className="my-blog-item__meta">
                  {blog.category} · {formatDate(blog.createdAt)}
                </p>
                <p className="my-blog-item__excerpt">{blog.about}</p>
              </div>

              <div className="my-blog-item__actions">
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  View
                </button>
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => navigate(`/update-blog/${blog._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDelete(blog._id)}
                  disabled={deleting === blog._id}
                >
                  {deleting === blog._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}