import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import "./MyBlogs.css";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchMyBlogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:4001/api/blogs/my-blogs", {
        withCredentials: true,
      });
      setMyBlogs(data);
    } catch (error) {
      setMyBlogs([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchMyBlogs();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:4001/api/blogs/delete/${id}`, {
          withCredentials: true,
        });
        setMyBlogs(myBlogs.filter((blog) => blog._id !== id));
      } catch (error) {
        alert("Failed to delete blog.");
      }
    }
  };

  return (
    <div className="myblogs-list">
      {myBlogs.length === 0 && (
        <div className="no-blogs">No blogs found. Create your first blog!</div>
      )}
      {myBlogs.map((blog) => (
        <div className="myblogs-card" key={blog._id}>
          <img src={blog.blogImage.url} alt={blog.title} className="myblogs-img" />
          <div className="myblogs-content">
            <span className="myblogs-category">{blog.category}</span>
            <h3 className="myblogs-title">{blog.title}</h3>
            <div className="myblogs-actions">
              {/* Update and Delete buttons */}
              <button
                className="myblogs-update"
                onClick={() => window.location.href = `/dashboard/updateblog/${blog._id}`}
              >
                UPDATE
              </button>
              <button
                className="myblogs-delete"
                onClick={() => handleDelete(blog._id)}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBlogs;
