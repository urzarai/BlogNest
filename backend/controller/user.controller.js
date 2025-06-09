import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import createTokenAndSaveCookies from "../jwt/AuthToken.js";


export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User Photo is required!" });
    }

    const { photo } = req.files;
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Please upload a valid image file (jpg, jpeg, png, webp)!",
      });
    }

    const { email, name, password, phone, education, role } = req.body;

    //if user fails to provide any data field then send this message
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

    const user = await User.findOne({ email });

    //if user with this email already exists then send this message
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this Emaill-ID already exists!" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      console.log(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Error uploading photo to Cloudinary!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password!" });
    }

    const newUser = new User({
      email,
      name,
      password: hashedPassword, // Storing the hashed password
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();
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
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user.password) {
      return res.status(400).json({ message: "User Password missing" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: `Given role - ${role} not found` });
    }
    const token = await createTokenAndSaveCookies(user._id, res);
    console.log("Logged In User Token:", token);
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
    const user = await req.user; // User info is attached to the request object by the isAuthenticated middleware
    res.status(200).json({message: "User profile fetched successfully!",user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}

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
}