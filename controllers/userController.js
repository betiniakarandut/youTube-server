import bcrypt from 'bcrypt'
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';
import userVerification from '../models/userVerification.js';
import User from "../models/userModel.js";
import { secret_key } from '../utils/configuration.js';

import dotenv from "dotenv";

dotenv.config()

const verificationCode = () => {
    const buffer = randomBytes(3);
    const uniqueCode = Math.floor(buffer.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0')
    return uniqueCode
}

// const code = verificationCode()
// console.log(code);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    Auth: {
        user: process.env.auth_email,
        pass: process.env.auth_password
    }
});

const verifyTransporter = transporter.verify((error, success) => {
    if(error){
        console.log(error);
    }else {
        console.log("Ready to send message")
        console.log(success)
    }
})


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
            username,
            verified: false,
        })
        // console.log(newUser);

        const payload = {
            userId: newUser._id,
            email: newUser.email,
            username: newUser.username
        }
        const jwtToken = jwt.sign(payload, secret_key, {expiresIn: "24h"});

        // console.log(jwtToken);

        await newUser.save().then((result) => {
            sendVerificationEmail(result, res)
        }).catch(() => {
            return res.status(400).json({
                message: "User not saved to database"
            })
        });
        return res.status(200).json({
            message: "New user created successfully",
            Token: jwtToken,
            user_details: newUser });
    } catch(err){
            return res.status(500).json({message:`Server error: ${err}`});

    }
}

export const sendVerificationEmail = ({_id, email}, res) => {
    const urlSender = "http://localhost:5005/"

    const uniqueString = verificationCode() + _id;

    const mailOptions = {
        from: process.env.auth_email,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email and complete your account setup</p><p>Link expires in 10hr.</p>
        <p>Press the link <a href=${urlSender + "user/verify/" + _id + "/" + uniqueString}>here</a>
        to proceed</p>`
    };

    bcrypt.hash(uniqueString, 10)
        .then((hashedUniqueString) => {
            const newVerification = new userVerification ({
                userId: _id,
                uniqueId: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() * 36000000
            })
            newVerification.save()
            .then(() => {
                transporter.sendMail(mailOptions)
                .then(() => {
                    return res.status(200).json({
                        message: "Pending!"
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(400).json({
                        status: "FAILED",
                        message: `Unable to send email: ${err}`
                    })
                })
            })
            .catch((err) => {
                console.log(err)
                return res.status(400).json({
                    status: "FAILED",
                    message: `Unable to verify user: ${err}`
                })
            })
        .catch((err) => {
            return res.status(400).json({
                status: "FAILED",
                message: `Unable to hash string: ${err}`
            })
        })

    })

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

        if (!userExist.verified) {
            return res.status(400).json({message: "User must be verified. Check you inbox for directions."})
        }

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

export const verify = async (req, res) => {
    const { userId, uniqueId } = req.body;

    userVerification.find(id)
    .then((result) => {
        if(result.length > 0){
            const {expiresAt} = result[0];
            const hashedUniqueString = result[0]
        }
        if (expiresAt < Date.now()) {
            userVerification.deleteOne({userId})
            .then((result) => {
                User.deleteOne({_id: uniqueId})
                .then(() => {
                    res.status(401).json({message: `Link has expired. Signup again!`})
                })
                .catch((err) => {
                    console.log(err)
                    res.status(401).json({message: `Oops! user not deleted: ${err}`})
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(401).json({message: `Unable to delete user: ${err}`})
            })
        } else {
            bcrypt.hash(uniqueString, hashedUniqueString)
            .then((result) => {
                if(result) {
                    User.updateOne(
                        {_id: userId},
                        {verified: true},
                    )
                    .then(() => {
                        userVerification.deleteOne({userId})
                        .then(() => {
                            return res.status(200).json({message: "Email verified successfully"})
                        })
                        .catch((err) => console.log(err))
                        res.status(200).json({message: "Updated succesfully"})
                    })
                    .catch((err) => console.log(err))
                }else {
                    res.status(400).json({message: 'Check the link and try again'})
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(400).json({message: "Oops! something went wrong"})
    })
}