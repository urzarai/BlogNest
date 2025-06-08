import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

const app = express();
dotenv.config();
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//Middleware - as we are sending in JSON format
app.use(express.json());

//Middleware - to handle file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//Database connection code
try {
  mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

//Defining routes
app.use("/api/users", userRoute);

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, 
});

app.get("/", (req, res) => {
  res.send("Hello Urza and Rahul!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
