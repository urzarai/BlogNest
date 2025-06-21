import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateBlog.css";

function UpdateBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/blogs/single-blog/${id}`);
        setBlog(data.blogs);
        setTitle(data.blogs.title);
        setCategory(data.blogs.category);
        setAbout(data.blogs.about);
      } catch (error) {
        alert("Failed to fetch blog details");
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:4001/api/blogs/update/${id}`,
        { title, category, about },
        { withCredentials: true }
      );
      alert("Blog updated successfully!");
      setLoading(false);
      navigateTo("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update blog");
      setLoading(false);
    }
  };

  if (!blog) return <div className="updateblogs-container">Loading...</div>;

  return (
    <div className="updateblogs-container">
      <h2>Update Blog</h2>
      <form className="updateblogs-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>About (min 200 chars)</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            minLength={200}
            className="form-input"
            rows={6}
          />
        </div>
        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}

export default UpdateBlog;