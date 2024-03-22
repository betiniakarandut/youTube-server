import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import { secret_key } from '../utils/configuration.js';


export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(username == '' || email == '' || password == '') {
            return res.json({
                status: "FAILED",
                message: "Some input fields are missing"
            })
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (emailRegex.test(email) == false){
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email address"
            })
        }
        if (password.length < 8){
            return res.status(400).json({
                status: "FAILED",
                message: "Password must be at least 8 characters long"
            })
        }

        const userExist = await User.findOne({email})
        if (userExist){
            return res.status(400).json({message:"User already exist exist"});
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            hashed_password,
            username
        })
        // console.log(newUser);

        const payload = {
            userId: newUser._id,
            email: newUser.email,
            username: newUser.username
        }
        const jwtToken = jwt.sign(payload, secret_key, {expiresIn: "24h"});

        // console.log(jwtToken);

        await newUser.save();
        return res.status(200).json({
            message: "New user created successfully",
            Token: jwtToken,
            user_details: newUser });
    } catch(err){
            return res.status(500).json({message:`Server error: ${err}`});

    }
}

export const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(username == '' || email == '' || password == '') {
            return res.json({
                status: "FAILED",
                message: "Some input fields are missing"
            })
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (emailRegex.test(email) == false){
            return res.json({
                status: "FAILED",
                message: "Invalid email address"
            })
        }
        if (password.length < 8){
            return res.status(400).json({
                status: "FAILED",
                message: "Password must be at least 8 characters long"
            })
        }

        const userExist = await User.findOne({email})

        if (!userExist){
            return res.status(401).json({message:"Invalid credentials. Check and try again"});
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const passwordMatch = await bcrypt.compare(password, hashed_password);

        if (!passwordMatch) {
            return res.status(401).json({message: "Invalid password. Check and try again"});
        }


        const payload = {
            userId: userExist._id,
            email: userExist.email
        }
        const jwtToken = jwt.sign(payload, secret_key, {expiresIn: '24h'})

        return res.status(200).json({
            message: "Logged in successfully",
            Token:jwtToken,
            user_details: userExist});
    } catch(err){
        return res.status(500).json({message:`Server error: ${err}`})
    }
}