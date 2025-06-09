// Import User model for user-related database operations
import { User } from "../models/user.model.js";

// Import Cloudinary for image upload functionality
import { v2 as cloudinary } from "cloudinary";

// Import bcrypt for hashing user passwords securely
import bcrypt from "bcryptjs";

// Import function to create JWT tokens and set them as cookies
import createTokenAndSaveCookies from "../jwt/AuthToken.js";


// ==================================
// Controller: Register a new user
// ==================================
export const register = async (req, res) => {
  try {
    // Check if user uploaded a photo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User Photo is required!" });
    }

    // Extract the uploaded photo
    const { photo } = req.files;

    // Allow only specific image formats
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // Validate image format
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Please upload a valid image file (jpg, jpeg, png, webp)!",
      });
    }

    // Destructure required fields from request body
    const { email, name, password, phone, education, role } = req.body;

    // Check if all fields are provided
    if (
      !email ||
      !name ||
      !password ||
      !phone ||
      !education ||
      !role ||
      !photo
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }

    // Check if a user with the same email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this Emaill-ID already exists!" });
    }

    // Upload user photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    // If upload failed, return error
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      console.log(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Error uploading photo to Cloudinary!" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password!" });
    }

    // Create a new user instance with hashed password and photo details
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token and set it as a cookie
    if (newUser) {
      const token = await createTokenAndSaveCookies(newUser._id, res);
      console.log("Registered User Token:", token);
      res.status(201).json({
        message: "User registered successfully!",
        newUser,
        token: token,
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// ==================================
// Controller: Log in a user
// ==================================
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Ensure required fields are provided
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }

    // Find user by email and include password field explicitly
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    // Check if password is stored (additional check)
    if (!user.password) {
      return res.status(400).json({ message: "User Password missing" });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    // If credentials are invalid
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Check if user's role matches the provided role
    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: `Given role - ${role} not found` });
    }

    // Generate JWT token and send in cookie
    const token = await createTokenAndSaveCookies(user._id, res);
    console.log("Logged In User Token:", token);

    // Respond with user info and token
    res.status(200).json({
      message: "User logged in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token: token,
    });
  } catch (error) {
    // Handle unexpected errors
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// ==================================
// Controller: Log out a user
// ==================================
export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie to log the user out
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// ==================================
// Controller: Get user profile
// ==================================
export const getUserProfile = async (req, res) => {
  try {
    // Assuming `isAuthenticated` middleware attaches user info to req.user
    const user = await req.user;

    // Send user profile
    res.status(200).json({
      message: "User profile fetched successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// ==================================
// Controller: Get all Admin users
// ==================================
export const getAdmins = async (req, res) => {
  try {
    // Find all users with role "Admin"
    const admins = await User.find({ role: "Admin" });

    // Handle case when no admins are found
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found!" });
    }

    // Respond with list of admins
    res.status(200).json({ message: "Admins fetched successfully!", admins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
