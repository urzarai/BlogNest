import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/blogs/all-blogs",
          { withCredentials: true }
        );
        setBlogs(data.blogs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlogs();
  }, []);

  const handleExpand = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };
 
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blogs-page">
      <h2 className="blogs-heading">All Blogs</h2>
      <div className="blogs-searchbar-container">
        <input
          className="blogs-searchbar"
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="blogs-list">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className={`blog-card${expandedBlogId === blog._id ? " expanded" : ""}`}>
            <div className="blog-card-top">
              <div className="blog-image-large">
                <img src={blog.blogImage.url} alt={blog.title} />
              </div>
              <div className="blog-category-badge">
                Category - {blog.category}
              </div>
            </div>
            <div className="blog-card-meta">
              <img src={blog.adminPhoto} alt={blog.adminName} className="blog-creator-photo" />
              <span className="blog-creator-name">{blog.adminName}</span>
            </div>
            <h3 className="blog-title">{blog.title}</h3>
            {expandedBlogId === blog._id && (
              <p className="blog-about">{blog.about}</p>
            )}
            <button className="read-btn" onClick={() => handleExpand(blog._id)}>
              {expandedBlogId === blog._id ? "Hide" : "Read"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
