import { v2 as cloudinary } from "cloudinary";
import { Blog } from "../models/blog.model.js";
import mongoose from "mongoose";

//Blog creation controller
export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Cover Image is required!" });
    }

    const { blogImage } = req.files;
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Please upload a valid image file (jpg, jpeg, png, webp)!",
      });
    }

    const { title, category, about } = req.body;

    //if user fails to provide any data field then send this message
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "Title, Category and About are mandatory fields" });
    }

    const adminName = req?.user?.name; // Assuming req.user is populated with the authenticated user's info
    const adminPhoto = req?.user?.photo; // Assuming req.user.photo contains the user's photo info
    const createdBy = req?.user?._id; // Assuming req.user._id contains the user's ID

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Error uploading photo to Cloudinary!" });
    }

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

    const blog = await Blog.create(blogData);

    res.status(201).json({
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//Blog deletion controller
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found!" });
  }
  await blog.deleteOne();
  await cloudinary.uploader.destroy(blog.blogImage.public_id);
  res.status(200).json({ message: "Blog deleted successfully!" });
};

//Get all blogs controller
export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json({
    message: "All blogs fetched successfully!",
    blogs: allBlogs,
  });
};

//Get a single blog
export const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    //If the ID is not a valid ObjectId stored in MongoDB, return an error
    return res.status(400).json({ message: "Invalid blog ID!" });
  }

    // Find the blog by ID and sort by createdAt in descending order
  const blog = await Blog.findById(id).sort({ createdAt: -1 });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found!" });
  }

  res.status(200).json({
    message: "Blog fetched successfully!",
    blogs: blog,
  });
};

//Get blogs of User
export const getMyBlogs = async (req, res) => {
    const createdBy = req.user._id; // Get the user ID from the authenticated user
    const myBlogs = await Blog.find({ createdBy }).sort({ createdAt: -1 });
    res.status(200).json(myBlogs);
}

//Update blog controller
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID!" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true} );
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found!" });
  }
  res.status(200).json({
    message: "Blog updated successfully!",
    blog: updatedBlog,
  });
};