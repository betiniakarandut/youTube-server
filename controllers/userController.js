import bcrypt from 'bcrypt'
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';
import userVerification from '../models/userVerification.js';
import User from "../models/userModel.js";
import userOTPVerification from '../models/userOTPModel.js';

import dotenv from "dotenv";

dotenv.config()

console.log("Is working!")

const sendVerificationEmail = async ({ _id, email }, res, uniqueString) => {
    const urlSender = "http://localhost:5000/";
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email and complete your account setup</p><p>Link expires in 10hrs.</p>
        <p>Press the link <a href=${urlSender + "user/verify/" + _id + "/" + uniqueString}>here</a>
        to proceed</p>`
    };

    try {
        const newVerification = new userVerification({
            userId: _id,
            uniqueId: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + (10 * 60 * 60 * 1000) // 10 hours in milliseconds
        });
        await newVerification.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PWD
            }
        });

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({
            message: "Pending!"
        });
    } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(400).json({
            status: "FAILED",
            message: `Unable to send email: ${error}`
        });
    }
}

console.log("Is working!")

export const signUp = async (req, res) => {
    console.log("Is working!")
    try {
        const { username, email, password, phone } = req.body;
        const phoneRegex = /^\+\d{1,2}\s?[\d\s-]{7,13}$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        if (username == '' || email == '' || password == '' || phone == '') {
            return res.json({
                status: "FAILED",
                message: "Some input fields are missing"
            });
        } else if (emailRegex.test(email) == false) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email address"
            });
        } else if (password.length < 8) {
            return res.status(400).json({
                status: "FAILED",
                message: "Password must be at least 8 characters long"
            });
        } else if (phoneRegex.test(phone) == false) {
            return res.status(400).json({
                status: "FAILED",
                message: "Phone number must be in the format +4538278984"
            });
        }

            const userExist = await User.findOne({ email });
            if (userExist) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashed_password = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                password: hashed_password,
                username,
                phone,
                verified: false,
            });

            const savedUser = await newUser.save();

            // // Generate verification code (6-digit)
            // const verificationCode = () => {
            //     const buffer = randomBytes(3);
            //     const uniqueCode = Math.floor(buffer.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0')
            //     return uniqueCode
            // }

            // console.log(verificationCode())
            // const verificationCode = Math.floor(100000 + Math.random() * 900000);

            // Send verification email
            // await sendVerificationEmail(savedUser, res, verificationCode());
            await sendOTPVerificationEmail(savedUser, res);

            return res.status(200).json({
                message: "New user created successfully",
                userDetails: savedUser
            });

    } catch (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const signIn = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const phoneRegex = /^\+\d{1,2}\s?[\d\s-]{7,13}$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if(username == '' || email == '' || password == '' || phone == '') {
            return res.json({
                status: "FAILED",
                message: "Some input fields are missing"
            })
        }else if (emailRegex.test(email) == false){
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email address"
            })
        } else if (password.length < 8){
            return res.status(400).json({
                status: "FAILED",
                message: "Password must be at least 8 characters long"
            })
        } else if (phoneRegex.test(phone) == false) {
            return res.status(400).json({
                status: "FAILED",
                message: "Phone number must be in the format +4538278984"
            })
        }

        const userExist = await User.findOne({email});

        if (!userExist){
            return res.status(401).json({message:"Invalid credentials. Check and try again"});
        }

        if (userExist.verified == false) {
            return res.status(400).json({message: "User is not verified. Signup again"})
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
        const jwtToken = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'})

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

    try {
        const verificationRecord = await userVerification.findOne({ userId });

        if (!verificationRecord) {
            return res.status(401).json({ message: 'Verification record not found' });
        }

        const { expiresAt, uniqueString } = verificationRecord;

        if (expiresAt < Date.now()) {
            await User.deleteOne({ _id: userId });
            await userVerification.deleteOne({ userId });

            return res.status(401).json({ message: 'Link has expired. Signup again!' });
        }

        // Verify the uniqueId against the hashed uniqueString
        const isUniqueIdValid = await bcrypt.compare(uniqueId, uniqueString);

        if (!isUniqueIdValid) {
            return res.status(400).json({ message: 'Invalid verification link' });
        }
        
        await User.updateOne({ _id: userId }, { verified: true });

        await userVerification.deleteOne({ userId });

        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        // Generate verification code (6-digit)
        const otpCode = () => {
            const buffer = randomBytes(3);
            const uniqueCode = Math.floor(buffer.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0')
            return uniqueCode
        }

        const otp = otpCode();

        console.log(`This your otp ${otp}`);

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification",
            html: `<p>Your 6 digits OTP verification code is <b>${otp}</b></p><p>Enter the <b>OTP</b> in the otp in the app to 
            complete your signup</p><p>Note: <b>Your OTP will expire in 30minutes</b></p>`
        }

        const hashedOTP = await bcrypt.hash(otp, 10);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PWD
            }
        });

        const newOTP = new userOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + (60 * 30 * 1000) // in milliseconds
        });

        await newOTP.save();

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: "PENDING",
            message: "OTP has been sent to your email",
            data: {
                userId: _id,
                email,
            },
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: `Internal server error: ${error}`});
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (userId == '' || otp == '') {
            throw new Error("Fields must not be empty");
        } else if (otp.length != 6) {
            throw new Error("OTP is 6 digits");
        } else if (!userId) {
            throw new Error("Invalid id.");
        }

        const userOTPRecordTrack = await userOTPVerification.find({userId});
        if (!userOTPRecordTrack) {
            throw new Error ("No record found for this user or has been verified already. Try Signing up again!");
        }

        const { expiresAt } = userOTPRecordTrack[0]
        const hashedOTP = userOTPRecordTrack[0].otp

        if (expiresAt < Date.now()) {
            await userOTPVerification.deleteMany({userId});
            throw new Error("OTP has expired. Signup again");
        } else {
           const validateOTP = bcrypt.compare(otp, hashedOTP);
           if (validateOTP == false) {
            throw new Error("Invalid OTP")
           } else {
            await User.updateOne({_id: userId}, {verified: true});
            await userOTPVerification.deleteMany({ userId });

            return res.status(200).json({
                status: "Success",
                message: "Congratulations, your email has verified successfully!",
            });
           }
        }  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error!"
        })
        
    }
}