import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, creatorsRes] = await Promise.all([
          axiosInstance.get("/api/blogs/all-blogs"),
          axiosInstance.get("/api/users/admins"),
        ]);
        setBlogs(blogsRes.data.blogs || []);
        setCreators(creatorsRes.data.admins || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featured = blogs[0] || null;
  const sideBlogs = blogs.slice(1, 4);
  const latestBlogs = blogs.slice(0, 6);

  if (loading) {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <p className="hero__eyebrow">Welcome to BlogNest</p>
        <h1 className="hero__title">
          Ideas worth <em>reading,</em><br />stories worth sharing.
        </h1>
        <p className="hero__description">
          A curated space for thoughtful writing. Discover perspectives from our
          community of writers, thinkers, and creators.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary btn--lg" onClick={() => navigate("/blogs")}>
            Explore Blogs
          </button>
          <button className="btn btn--outline btn--lg" onClick={() => navigate("/creators")}>
            Meet Creators
          </button>
        </div>

        {blogs.length > 0 && (
          <div className="hero__stat-row">
            <div className="hero__stat">
              <span className="hero__stat-number">{blogs.length}</span>
              <span className="hero__stat-label">Articles</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">{creators.length}</span>
              <span className="hero__stat-label">Creators</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">
                {[...new Set(blogs.map((b) => b.category))].length}
              </span>
              <span className="hero__stat-label">Categories</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Featured ── */}
      {featured && (
        <section className="featured-strip">
          <div className="section-header">
            <p className="section-eyebrow">Featured</p>
            <h2 className="section-title">Editor's Picks</h2>
          </div>

          <div className="featured-grid">
            <article className="featured-main" onClick={() => navigate(`/blog/${featured._id}`)} style={{ cursor: "pointer" }}>
              <div className="featured-main__image-wrap">
                <img src={featured.blogImage?.url} alt={featured.title} className="featured-main__image" />
              </div>
              <div className="featured-main__content">
                <span className="badge badge--category">{featured.category}</span>
                <h3 className="text-serif" style={{ fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.25, marginTop: "0.75rem", letterSpacing: "-0.015em" }}>
                  {featured.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.6rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6 }}>
                  {featured.about}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1.25rem" }}>
                  <img src={featured.adminPhoto} alt={featured.adminName} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{featured.adminName}</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>{formatDate(featured.createdAt)}</span>
                </div>
              </div>
            </article>

            <div className="featured-side">
              {sideBlogs.map((blog) => (
                <article key={blog._id} className="featured-side__item" onClick={() => navigate(`/blog/${blog._id}`)}>
                  <img src={blog.blogImage?.url} alt={blog.title} className="featured-side__image" />
                  <span className="badge badge--category">{blog.category}</span>
                  <h4 className="text-serif" style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem", lineHeight: 1.3 }}>
                    {blog.title}
                  </h4>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--mono)", marginTop: "0.4rem" }}>
                    {formatDate(blog.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Blogs ── */}
      <section className="latest-blogs">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <p className="section-eyebrow">Latest</p>
            <h2 className="section-title">Recent Articles</h2>
          </div>
          <button className="btn btn--outline" onClick={() => navigate("/blogs")}>View all →</button>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <p className="empty-state__title">No blogs yet</p>
            <p className="empty-state__desc">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {latestBlogs.map((blog) => (
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
      </section>

      {/* ── Creators Spotlight ── */}
      {creators.length > 0 && (
        <section className="home-creators">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <p className="section-eyebrow">The Team</p>
              <h2 className="section-title">Our Creators</h2>
            </div>
            <button className="btn btn--outline" onClick={() => navigate("/creators")}>All creators →</button>
          </div>

          <div className="creators-row">
            {creators.slice(0, 5).map((creator) => (
              <div key={creator._id} className="creator-card" onClick={() => navigate("/creators")}>
                <img src={creator.photo?.url} alt={creator.name} className="creator-card__avatar" />
                <p className="creator-card__name">{creator.name}</p>
                <p className="creator-card__education">{creator.education}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}