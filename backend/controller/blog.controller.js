// Import Cloudinary SDK (version 2) for image uploading
import { v2 as cloudinary } from "cloudinary";

// Import the Blog model for database operations
import { Blog } from "../models/blog.model.js";

// Import Mongoose for MongoDB-related utilities (like checking ObjectId validity)
import mongoose from "mongoose";


// ===============================
// Controller: Create a new blog
// ===============================
export const createBlog = async (req, res) => {
  try {
    // Check if any file is uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Cover Image is required!" });
    }

    // Extract the uploaded blog image
    const { blogImage } = req.files;

    // Define allowed image MIME types
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // Validate image format
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Please upload a valid image file (jpg, jpeg, png, webp)!",
      });
    }

    // Extract blog details from request body
    const { title, category, about } = req.body;

    // Validate required fields
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "Title, Category and About are mandatory fields" });
    }

    // Extract user info from the authenticated request
    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo;
    const createdBy = req?.user?._id;

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );

    // Check for errors during Cloudinary upload
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Error uploading photo to Cloudinary!" });
    }

    // Prepare blog data for database insertion
    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    };

    // Save the new blog in the database
    const blog = await Blog.create(blogData);

    // Respond with success
    res.status(201).json({
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    // Handle server errors
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// ===============================
// Controller: Delete a blog
// ===============================
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  // Find the blog by ID
  const blog = await Blog.findById(id);

  // If blog not found, return 404
  if (!blog) {
    return res.status(404).json({ message: "Blog not found!" });
  }

  // Delete blog from database
  await blog.deleteOne();

  // Delete the associated image from Cloudinary
  await cloudinary.uploader.destroy(blog.blogImage.public_id);

  // Respond with success
  res.status(200).json({ message: "Blog deleted successfully!" });
};


// ===============================
// Controller: Get all blogs
// ===============================
export const getAllBlogs = async (req, res) => {
  // Fetch all blogs sorted by creation date (newest first)
  const allBlogs = await Blog.find().sort({ createdAt: -1 });

  // Respond with the list of blogs
  res.status(200).json({
    message: "All blogs fetched successfully!",
    blogs: allBlogs,
  });
};


// ===============================
// Controller: Get a single blog by ID
// ===============================
export const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID!" });
  }

  // Find the blog by ID
  const blog = await Blog.findById(id).sort({ createdAt: -1 });

  // If blog not found, return 404
  if (!blog) {
    return res.status(404).json({ message: "Blog not found!" });
  }

  // Respond with the blog
  res.status(200).json({
    message: "Blog fetched successfully!",
    blogs: blog,
  });
};


// ===============================
// Controller: Get blogs created by the current user
// ===============================
export const getMyBlogs = async (req, res) => {
  const createdBy = req.user._id; // Extract user ID from request

  // Fetch blogs created by the authenticated user, sorted by newest first
  const myBlogs = await Blog.find({ createdBy }).sort({ createdAt: -1 });

  // Respond with the user's blogs
  res.status(200).json(myBlogs);
};


// ===============================
// Controller: Update a blog
// ===============================
export const updateBlog = async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID!" });
  }

  // Update the blog with new data
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

  // If blog not found, return 404
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found!" });
  }

  // Respond with the updated blog
  res.status(200).json({
    message: "Blog updated successfully!",
    blog: updatedBlog,
  });
};
