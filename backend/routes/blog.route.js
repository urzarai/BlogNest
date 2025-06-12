import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getMyBlogs, getSingleBlog, updateBlog } from "../controller/blog.controller.js";
import { isAdmin, isAutheticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create",isAutheticated,isAdmin("Admin"), createBlog);     //dont give create blog access if not authenticated, only admins can create blog
router.delete("/delete/:id", isAutheticated, isAdmin("Admin"), deleteBlog); // only admins can delete blogs
router.get("/all-blogs",  getAllBlogs); // get all blogs
router.get("/single-blog/:id",  getSingleBlog); // get single blog
router.get("/my-blogs", isAutheticated,isAdmin("Admin"), getMyBlogs); // get all blogs of user, only admins can do this
router.put("/update/:id", isAutheticated, isAdmin("Admin"), updateBlog); // update blog, only admins can do this

export default router; 