import React from 'react'
import './BlogCard.css'


export default function BlogCard({ blog }) {
  return (
    <div className="blog-card">
      <div className="blog-card-img">
        <img src={blog.blogImage?.url || '/assets/background.jpeg'} alt={blog.title} />
      </div>
      <div className="blog-card-content">
        <h3>{blog.title}</h3>
        <p className="blog-card-category">{blog.category}</p>
        <p className="blog-card-about">
          {blog.about.length > 120 ? blog.about.substring(0, 120) + '...' : blog.about}
        </p>
        <div className="blog-card-admin">
          <span>{blog.adminName}</span>
        </div>
      </div>
    </div>
  )
}
