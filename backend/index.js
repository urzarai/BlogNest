// Importing required modules and packages
import express from "express"; // Web framework for Node.js
import dotenv from "dotenv"; // Loads environment variables from .env file
import mongoose from "mongoose"; // MongoDB object modeling tool
import userRoute from "./routes/user.route.js"; // User routes
import blogRoute from "./routes/blog.route.js"; // Blog routes
import fileUpload from "express-fileupload"; // Middleware for handling file uploads
import { v2 as cloudinary } from "cloudinary"; // Cloudinary for image uploads
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import cors from "cors"; // Middleware for enabling CORS
import path from "path"; // Node.js path module for handling file paths

// Initialize the Express application
const app = express();

// Load environment variables into process.env
dotenv.config();

// Retrieve environment variables
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Set the static directory for serving files
const __dirname = path.resolve(); // Get the current directory


// ===================== Middlewares =====================
// Enables Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  "http://localhost:5173",
  "https://blognest-gvv7.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Parses incoming requests with JSON payloads
app.use(express.json()); 

// Parses cookies attached to the client request object
app.use(cookieParser());

// Enables file uploads and stores temporary files in /tmp directory
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ===================== Database Connection =====================
try {
  // Connect to MongoDB using mongoose
  mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
} catch (error) {
  // Log any connection errors
  console.log(error);
}

// ===================== Route Definitions =====================

// Routes for user-related API endpoints
app.use("/api/users", userRoute);

// Routes for blog-related API endpoints
app.use("/api/blogs", blogRoute);

// Serve static files 
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Serve the frontend application
app.get("/*any", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// ===================== Cloudinary Configuration =====================
// Set up Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ===================== Root Route =====================
// A basic route for the root URL to confirm the server is running
app.get("/", (req, res) => {
  res.send("Backend Server is Running....");
});

// ===================== Start the Server =====================
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
