import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


//Authentication
export const isAutheticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Token from cookies (Middleware):", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    if(!token ) {
      return res.status(401).json({ message: "Authentication Error!" });
    }
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    req.user = user; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication Error!" });
  }
};



//Authorization
//only admin should be able to create blog
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: `${req.user.role}s are not allowed to Create blogs!` });
      }
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  };
};
