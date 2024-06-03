import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

export const middlewareAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: "FAILED",
                message: "Authorization header missing"
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: "FAILED",
                message: "Token missing"
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            return res.status(401).json({
                status: "FAILED",
                message: "User unauthorized"
            });
        }

        const user = await User.findById(decodedToken.userId);
        if (decodedToken.exp < Date.now() / 1000) {
            if (!user) {
                return res.status(403).json({
                    status: "FAILED",
                    message: "Invalid user"
                });
            }

            const newToken = generateNewToken(user);
            res.setHeader('Authorization', `Bearer ${newToken}`);
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Internal server error:", error);
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: "FAILED",
                message: `Token expired`
            });
        }
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
};

const generateNewToken = (user) => {
    const token = jwt.sign({
        userId: user._id,
        email: user.email
    },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
    );

    return token;
};
