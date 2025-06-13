import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import "./CreateBlogs.css";
import { useNavigate } from "react-router-dom";

function CreateBlogs() {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const handleImageChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !about || !blogImage) {
      alert("All fields are required!");
      return;
    }
    if (about.length < 200) {
      alert("About section must be at least 200 characters.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    formData.append("blogImage", blogImage);

    try {
      await axios.post("http://localhost:4001/api/blogs/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog created successfully!");
      setTitle("");
      setCategory("");
      setAbout("");
      setBlogImage(null);
      setLoading(false);
      navigateTo("/dashboard");
    } catch (error) {
      setTitle("");
      setCategory("");
      setAbout("");
      alert(error.response?.data?.message || "Failed to create blog");
      setLoading(false);
    }
  };

  return (
    <div className="createblogs-container">
      <h2>Create Blog</h2>
      <form className="createblogs-form" onSubmit={handleSubmit} encType="multipart/form-data">
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
        <div className="form-group">
          <label>Blog Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlogs;
