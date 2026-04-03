import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config({ path: "./.env" });


const app = express();
const port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const __dirname = path.resolve();

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});