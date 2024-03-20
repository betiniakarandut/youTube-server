import bcrypt from 'bcrypt'
import jwt from 'jsonwebtokens';
import userSchema from "../models/userModel.js";
import { secret_key } from '../utils/configuration.js';


const signUp = async (req, res) => {
    try {
        const { username, email, password } = req;
        const userExist = await userSchema.username.findOne({email})
        if (userExist){
            res.status(400).json({message:"User already exist exist"});
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            hashed_password,
            username
        }

        const payload = {
            userId: newUser._id,
            email: newUser.email
        }
        const jwtToken = jwt.sign(payload, secret_key, {expires: '24h'})


        await newUser.save().then(() => {
            
            res.status(200).json({jwtToken, userExist});
        }).catch(() => {
            res.status(400).json({message:"Failed to create YouTube user. Try again!"})
        })  
    } catch{
        (err) => {
            res.status(500).json({message:`Server error: ${err}`})
        }
    }
}

const signIn = async (req, res) => {
    try {
        const { username, email, password } = req;
        const userExist = await userSchema.username.findOne({email})
        if (!userExist){
            res.status(401).json({message:"Invalid credentials. Check and try again"});
        }

        const passwordMatch = await bcrypt.compare(password, userExist.hashed_password);
        if (!passwordMatch) {
            res.status(401).json({message: "Invalid password. Check and try again"});
        }


        const payload = {
            userId: newUser._id,
            email: newUser.email
        }
        const jwtToken = jwt.sign(payload, secret_key, {expires: '24h'})

        res.status(200).json({jwtToken, userExist});
    } catch{
        (err) => {
            res.status(500).json({message:`Server error: ${err}`})
        }
    }
}