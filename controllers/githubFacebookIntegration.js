import axios from "axios";
import User from "../models/userModel.js";

export const githubSignUp = async(req, res) => {
    try {
        const { githubUsername } = req.body;
        if (githubUsername == '') {
            res.status(400).json({
                status: "FAILED",
                message: "Username cannot be empty"
            });
        }

        const result = await axios.get(`https://api.github.com/users/${githubUsername}`);

        if (result.status != 200) {
            return res.status(400).json({
                status: "FAILED",
                message: "There was a problem signing up user. Ensure you are connected to the internet"
            })
        }
        const newUser = new User({
            username: githubUsername,
            verified: true,
        })

        await newUser.save()
        
        res.status(200).json({
            status: "Success!",
            message: `User saved successfully`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error. Unable to sign up user"
        })
    }
}

export const facebookSignUp = async(req, res) => {
    try {
        const { facebookUsername } = req.body;
        if (facebookUsername == '') {
            res.status(400).json({
                status: "FAILED",
                message: "Username cannot be empty"
            });
        }

        const result = await axios.get(`https://api.github.com/users/${facebookUsername}`);

        if (result.status != 200) {
            return res.status(400).json({
                status: "FAILED",
                message: "There was a problem signing up user. Ensure you are connected to the internet"
            })
        }
        const newUser = new User({
            username: facebookUsername,
            verified: true,
        })

        await newUser.save()
        
        res.status(200).json({
            status: "Success!",
            message: `User saved successfully`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error. Unable to sign up user"
        })
    }
}