import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({
                message: "Missing Google idToken"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({
                message: "Invalid Google token"
            });
        }

        const googleId = payload.sub;
        const username =
            payload.name?.trim() ||
            payload.given_name?.trim() ||
            "Google User";

        if (!googleId) {
            return res.status(401).json({
                message: "Google account id not found"
            });
        }

        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({
                "googleId": googleId,
                "username": username,
                "creationDate": new Date()
            });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                googleId: user.googleId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        
        console.log("Log: An user successfully authenticated");
        return res.status(200).json({
            message: "Google authentication was successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                googleId: user.googleId
            }
        });
    } catch (error) {
        console.error("googleAuth error:", error);

        return res.status(500).json({
            message: "Google authentication failed"
        });
    }
};
