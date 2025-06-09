// Import the JWT package for signing and verifying JSON Web Tokens
import jwt from 'jsonwebtoken';

// Import the User model for database operations
import { User } from "../models/user.model.js";

// ========================================
// Function: Create JWT and store it in a cookie
// ========================================
const createTokenAndSaveCookies = async (userId, res) => {
    // Generate a signed JWT using the userId and secret key from environment variables
    const token = jwt.sign(
        { userId }, // Payload: userId used to identify the user
        process.env.JWT_SECRET_KEY, // Secret key for signing the token
        {
            expiresIn: '30d', // Token expires after 30 days
        }
    );

    // Set the generated token in an HTTP-only cookie to enhance security
    res.cookie("jwt", token, {
        httpOnly: true,    // Prevents client-side JavaScript from accessing the cookie
        secure: true,      // Ensures the cookie is only sent over HTTPS
        sameSite: "strict" // Cookie is sent only for same-site requests
    });

    // Save the token to the user's record in the database (for optional tracking or revocation)
    await User.findByIdAndUpdate(userId, { token });

    // Return the generated token
    return token;
}

// Export the function to be used in authentication controllers
export default createTokenAndSaveCookies;
