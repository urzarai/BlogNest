import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User Photo is required!" });
    }

    const { photo } = req.files;

    const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Please upload a valid image file (jpg, jpeg, png, webp)!",
      });
    }

    const { email, name, password, phone, education, role } = req.body;

    if (!email || !name || !password || !phone || !education || !role) {
      return res.status(400).json({ message: "Please fill all required fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this Email-ID already exists!" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return res.status(500).json({ message: "Error uploading photo to Cloudinary!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    await newUser.save();

    const token = await createTokenAndSaveCookies(newUser._id, res);
    res.status(201).json({
      message: "User registered successfully!",
      newUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields!" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Given role - ${role} not found` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);
    res.status(200).json({
      message: "User logged in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User profile fetched successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "Admin" });
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found!" });
    }
    res.status(200).json({ message: "Admins fetched successfully!", admins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};