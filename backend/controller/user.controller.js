import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary"; 
import bcrypt from "bcryptjs";          // Importing bcrypt for password hashing

//Data being sent
export const register = async (req, res) => {
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

  //if user fails to provide any data field then send this message
  if (!email || !name || !password || !phone || !education || !role || !photo) {
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
    return res
      .status(201)
      .json({ message: "User registered successfully!", newUser });
  }
};
