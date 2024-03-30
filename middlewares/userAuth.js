import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

export const middlewareAuth = async (req, res, next) => {
    try {
        // get the jwt token from authorization headers
        const token = req.headers.authorization.split(' ')[1];

        // check if decoded token is valid against a secret key
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    
        if (!decodedToken) {
            return res.status(401).json({
                status: "FAILED",
                message: "User unauthorized"
            });
        }
        // assign user to the id associated with the token
        const user = await User.findById(decodedToken.userId);
        req.user = user;

        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: "FAILED",
            message: `Authentication failed ${error}`
        });
    }
}