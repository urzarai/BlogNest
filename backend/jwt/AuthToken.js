import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async(userId,res) =>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d', // Token will expire in 30 days
    });
    res.cookie("jwt", token, {
        httpOnly: true, // Cookie is not accessible via JavaScript
        secure: true, // Cookie is only sent over HTTPS
        sameSite: "strict", // Cookie is only sent to the same site
    });
    await User.findByIdAndUpdate(userId, { token });
    return token;
}

export default createTokenAndSaveCookies;