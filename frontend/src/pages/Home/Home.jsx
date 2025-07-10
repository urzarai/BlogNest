import React, { useEffect, useState } from 'react';
import BlogCard from '../../components/BlogCard/BlogCard';
import axios from 'axios';
import './Home.css';

export default function Home() {
  // Refresh-once-after-redirect logic
  useEffect(() => {
    // If not yet reloaded in this session, set flag and reload
    if (!sessionStorage.getItem('homeReloaded')) {
      sessionStorage.setItem('homeReloaded', 'true');
      window.location.reload();
    } else {
      // Remove flag after reload to allow future navigations
      sessionStorage.removeItem('homeReloaded');
    }
  }, []);

  const [recentBlogs, setRecentBlogs] = useState([]);
  const [popularCreators, setPopularCreators] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent blogs
        const blogsRes = await axios.get(
          "https://blognest-gvv7.onrender.com/api/blogs/all-blogs",
          { withCredentials: true }
        );
        setRecentBlogs(blogsRes.data.blogs.slice(0, 3));

        // Fetch popular creators
        const creatorsRes = await axios.get(
          "https://blognest-gvv7.onrender.com/api/users/admins",
          { withCredentials: true }
        );
        setPopularCreators(creatorsRes.data.admins.slice(0, 4));
      } catch (error) {
        setRecentBlogs([]);
        setPopularCreators([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to BlogNest</h1>
          <p>
            Unleash your creativity and explore a world of ideas. Dive into thought-provoking articles, connect with talented creators, and be part of a vibrant community that celebrates every voice.
          </p>
        </div>
      </div>

      <section className="home-section">
        <h2>Recent Blogs</h2>
        <div className="home-blogs-list">
          {recentBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      <section className="home-section">
        <h2>Popular Creators</h2>
        <div className="home-creators-list">
          {popularCreators && popularCreators.length > 0 ? (
            popularCreators.map(creator => (
              <div key={creator._id} className="creator-card">
                <img
                  src={creator.photo?.url}
                  alt={creator.name}
                  className="creator-avatar"
                />
                <div className="creator-info">
                  <p className="creator-name">{creator.name}</p>
                  <p className="creator-role">{creator.role}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No creators found.</div>
          )}
        </div>
      </section>

      <section className="home-section why-choose">
        <h2>Why Choose Us?</h2>
        <div className="content-wrapper">
          <p>
            At BlogNest, we empower storytellers and readers alike. Whether you're here to share your expertise, discover fresh perspectives, or build lasting connections, our platform is designed to inspire, inform, and unite passionate minds from around the globe.
          </p>
        </div>
      </section>
    </div>
  );
}
