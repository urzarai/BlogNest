import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Blogs() {
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/blogs/all-blogs")
      .then((res) => setBlogs(res.data.blogs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];
  const filtered   = activeFilter === "All" ? blogs : blogs.filter((b) => b.category === activeFilter);

  return (
    <div>
      <div className="blogs-page__header">
        <p className="section-eyebrow">Archive</p>
        <h1 className="section-title">All Articles</h1>
        <p className="section-subtitle">Browse {blogs.length} articles across {categories.length - 1} categories.</p>

        <div className="blogs-page__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeFilter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="blogs-page__grid">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <p className="empty-state__title">No articles found</p>
            <p className="empty-state__desc">Try a different category.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filtered.map((blog) => (
              <article key={blog._id} className="blog-card" onClick={() => navigate(`/blog/${blog._id}`)}>
                <div className="blog-card__image-wrap">
                  <img src={blog.blogImage?.url} alt={blog.title} className="blog-card__image" />
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__category">{blog.category}</span>
                    <span className="blog-card__date">{formatDate(blog.createdAt)}</span>
                  </div>
                  <h3 className="blog-card__title">{blog.title}</h3>
                  <p className="blog-card__excerpt">{blog.about}</p>
                </div>
                <div className="blog-card__footer">
                  <img src={blog.adminPhoto} alt={blog.adminName} className="blog-card__author-avatar" />
                  <span className="blog-card__author-name">{blog.adminName}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}