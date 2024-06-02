import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

export const middlewareAuth = async (req, res, next) => {
    try {
        // get the jwt token from authorization headers
        const token = req.headers.authorization.split(' ')[1];
        console.log("token is:", token);

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
                })
            }

            const newToken = generateNewToken(user);
            res.setHeader('Authorization', `Bearer ${newToken}`);
        }
        // assign user to the id associated with the token
        req.user = user;

        next();

    } catch (error) {
        console.log("Internal server error:", error)
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            console.log(error);
            return res.status(401).json({
                status: "FAILED",
                message: `Token expired`
            });
        }
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error ok"
        });

    }      
}

const generateNewToken = (user) => {

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
    },
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
    );

    return token;
}