// Importing the User model to query user data from the database
import { User } from "../models/user.model.js";

// Importing jsonwebtoken for token verification
import jwt from "jsonwebtoken";


// ========================= Authentication Middleware =========================
// Purpose: Verifies that a user is logged in by checking for a valid JWT token
export const isAutheticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.jwt;
    console.log("Token from cookies (Middleware):", token);

    // Decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user from the decoded userId and exclude the password field
    const user = await User.findById(decoded.userId).select("-password");

    // If no token is found, return an authentication error
    if (!token) {
      return res.status(401).json({ message: "Authentication Error!" });
    }

    // If the user doesn't exist in the database
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Attach user object to request so that subsequent middleware/routes can access it
    req.user = user;

    // Pass control to the next middleware/route
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication Error!" });
  }
};



// ========================= Authorization Middleware =========================
// Purpose: Restricts access to specific roles (e.g., only Admins can create blogs)
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    try {
      // If the user's role is not included in the allowed roles, deny access
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: `${req.user.role}s are not allowed to Create blogs!`
        });
      }

      // If role is valid, continue to the next middleware/route
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  };
};
