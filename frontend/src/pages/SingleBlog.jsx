import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    axiosInstance.get(`/api/blogs/single-blog/${id}`)
      .then((res) => setBlog(res.data.blogs))
      .catch(() => setError("Blog not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (error || !blog) {
    return (
      <div className="empty-state" style={{ paddingTop: "8rem" }}>
        <div className="empty-state__icon">🔍</div>
        <p className="empty-state__title">{error || "Blog not found"}</p>
        <button className="btn btn--outline mt-3" onClick={() => navigate("/blogs")}>← Back to Blogs</button>
      </div>
    );
  }

  return (
    <article className="single-blog">
      {/* Full-width hero image */}
      <img src={blog.blogImage?.url} alt={blog.title} className="single-blog__hero-image" />

      {/* Header */}
      <header className="single-blog__header">
        <div className="single-blog__meta">
          <span className="single-blog__category badge badge--category">{blog.category}</span>
          <span className="single-blog__date">{formatDate(blog.createdAt)}</span>
        </div>
        <h1 className="single-blog__title">{blog.title}</h1>

        <div className="single-blog__author">
          <img src={blog.adminPhoto} alt={blog.adminName} className="single-blog__author-avatar" />
          <div>
            <p className="single-blog__author-name">{blog.adminName}</p>
            <p className="single-blog__author-label">Author</p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="single-blog__body">
        {blog.about}
      </div>

      {/* Back link */}
      <div style={{ padding: "2rem clamp(1.5rem, 5vw, 2rem)", borderTop: "0.5px solid var(--border)" }}>
        <button className="btn btn--outline" onClick={() => navigate("/blogs")}>← Back to Blogs</button>
      </div>
    </article>
  );
}