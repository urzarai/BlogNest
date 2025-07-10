import React, { useState } from "react";
import axios from "axios";
import "./DeleteBlogs.css";

function DeleteBlogs() {
  const [blogId, setBlogId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!blogId) {
      alert("Please enter a Blog ID.");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`https://blognest-gvv7.onrender.com/api/blogs/delete/${blogId}`, {
        withCredentials: true,
      });
      alert("Blog deleted successfully!");
      setBlogId("");
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete blog");
      setLoading(false);
    }
  };

  return (
    <div className="deleteblogs-container">
      <h2>Delete Blog</h2>
      <form className="deleteblogs-form" onSubmit={handleDelete}>
        <div className="form-group">
          <label>Blog ID</label>
          <input
            type="text"
            value={blogId}
            onChange={(e) => setBlogId(e.target.value)}
            required
            className="form-input"
            placeholder="Enter Blog ID to delete"
          />
        </div>
        <button type="submit" className="delete-btn" disabled={loading}>
          {loading ? "Deleting..." : "Delete Blog"}
        </button>
      </form>
    </div>
  );
}

export default DeleteBlogs;
