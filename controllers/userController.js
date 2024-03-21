import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import { secret_key } from '../utils/configuration.js';


export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await User.findOne({email})
        if (userExist){
            return res.status(400).json({message:"User already exist exist"});
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            hashed_password,
            // username
        })

        const payload = {
            userId: newUser._id,
            email: newUser.email
        }
        const jwtToken = jwt.sign(payload, secret_key, {expires: '24h'});


        await newUser.save();
        return res.status(200).json({ jwtToken, userExist });
    } catch{
        (err) => {
            return res.status(500).json({message:`Server error: ${err}`});
        }
    }
}

export const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await User.findOne({email})
        if (!userExist){
            return res.status(401).json({message:"Invalid credentials. Check and try again"});
        }

        const passwordMatch = await bcrypt.compare(password, userExist.hashed_password);
        if (!passwordMatch) {
            return res.status(401).json({message: "Invalid password. Check and try again"});
        }


        const payload = {
            userId: userExist._id,
            email: userExist.email
        }
        const jwtToken = jwt.sign(payload, secret_key, {expires: '24h'})

        return res.status(200).json({jwtToken, userExist});
    } catch(err){
            return res.status(500).json({message:`Server error: ${err}`})
    }
}