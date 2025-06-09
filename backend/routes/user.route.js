import express from "express";
import { getAdmins, getUserProfile, login, logout, register } from "../controller/user.controller.js";
import { isAutheticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAutheticated, logout);
router.get("/my-profile",isAutheticated, getUserProfile); 
router.get("/admins",getAdmins);

export default router;