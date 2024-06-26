import bcrypt from 'bcrypt'
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';
import twilio from "twilio";
import userVerification from '../models/userVerification.js';
import User from "../models/userModel.js";
import userOTPVerification from '../models/userOTPModel.js';

import dotenv from "dotenv";

dotenv.config()

console.log("Is working!")

const sendVerificationEmail = async (user, res, uniqueString) => {
    const urlSender = "http://0.0.0.0:5000/";
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: "Verify your email",
        html: `<p>Verify your email and complete your account setup</p><p>Link expires in 10hrs.</p>
        <p>Press the link <a href=${urlSender + "user/verify/" + user._id + "/" + uniqueString}>here</a>
        to proceed</p>`
    };

    try {
        const newVerification = new userVerification({
            userId: user._id,
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

    } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(400).json({
            status: "FAILED",
            message: `Unable to send email: ${error}`
        });
    }
};

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

        console.log(process.env.ADMIN);

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        
        if (process.env.ADMIN.includes(email)) {
            const newUser = new User({
                email,
                password: hashed_password,
                username,
                phone,
                verified: false,
                admin: true,
            });
            
            const savedUser = await newUser.save();
    
            await sendOTPVerificationEmailAndSMS(savedUser, res);

            // return res.status(200).json({
            //     message: "New user created successfully",
            //     userDetails: savedUser
            // });
        }

        const newUser = new User({
            email,
            password: hashed_password,
            username,
            phone,
            verified: false,
        });

        const savedUser = await newUser.save();
        
        await sendOTPVerificationEmailAndSMS(savedUser, res);

        // res.status(201).send({
        //     message: "New user created successfully",
        //     userDetails: savedUser
        // });

    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        // const phoneRegex = /^\+\d{1,2}\s?[\d\s-]{7,13}$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if(email == '' || password == '') {
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
        //} // else if (phoneRegex.test(phone) == false) {
            // return res.status(400).json({
            //     status: "FAILED",
            //     message: "Phone number must be in the format +4538278984"
            // })
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
            token:jwtToken,
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

export const sendOTPVerificationEmailAndSMS = async ({ _id, email, phone }, res) => {
    try {
        // Generate verification code (6-digit)
        const generateOTP = () => {
            const buffer = randomBytes(3);
            const uniqueCode = Math.floor(buffer.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0')
            return uniqueCode
        }

        const otp = generateOTP();

        console.log(`This your otp ${otp}`);

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification",
            html: `<p>Your 6 digits OTP verification code is <b>${otp}</b></p><p>Enter the <b>OTP</b> in the otp in the app to 
            complete your signup</p><p>Note: <b>Your OTP will expire in 30minutes</b></p>`
        }

        const smsOptions = {
          body: `Betini sent you a code:Your verification code is:${otp}`,
          from: "+19035463210",
          to: phone,
        }

        const hashedOTP = await bcrypt.hash(otp, 10);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PWD,
            }
        });

        const client = twilio(process.env.ACCT_SSID, process.env.AUTH_TOKEN);

        const newOTP = new userOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + (60 * 30 * 1000) // in milliseconds
        });

        await newOTP.save();

        await transporter.sendMail(mailOptions);
        await client.messages.create(smsOptions);

        return res.status(200).json({
            status: "PENDING",
            message: "OTP has been sent to your email and through SMS",
            data: {
                userId: _id,
                email,
                phone,
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

        if (!userId || !otp) {
            return res.status(400).json({
                status: "FAILED",
                message: "Fields must not be empty"
            });
        } 
        
        if (otp.length !== 6) {
            return res.status(400).json({
                status: "FAILED",
                message: "OTP is 6 digits"
            });
        }

        const userOTPRecordTrack = await userOTPVerification.find({ userId });
        if (!userOTPRecordTrack.length) {
            return res.status(400).json({
                status: "FAILED",
                message: "No record found for this user or has been verified already. Try Signing up again!"
            });
        }

        const { expiresAt, otp: hashedOTP } = userOTPRecordTrack[0];

        if (expiresAt < Date.now()) {
            await userOTPVerification.deleteMany({ userId });
            return res.status(400).json({
                status: "FAILED",
                message: "OTP has expired. Signup again"
            });
        }

        const validateOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validateOTP) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid OTP"
            });
        }

        await User.updateOne({ _id: userId }, { verified: true });
        await userOTPVerification.deleteMany({ userId });

        return res.status(200).json({
            status: "Success",
            message: "Congratulations, your email has been verified successfully!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error!"
        });
    }
}


export const deleteUser = async(req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const deletedUserId = req.params.deletedUserId;

        if (!userId && user.admin == false) {
            return res.status(403).json({
                status: "SUCCESS",
                message: "user is forbidden"
            });
        }

        if (!deletedUserId) {
            return res.status(404).json({
                status:"FAILED",
                message: "user not found"
            });
        }

        const delUser = await User.findByIdAndDelete(deletedUserId);

        if (delUser == null){
            return res.send("user deleted already or does not exist");
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "User was deleted successfully from database",
            deleted: delUser,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
} 

export const updateUser = async(req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const { username, email, password, phone } = req.body;

        if (!userId && user.admin == false) {
            return res.status(403).json({
                status: "SUCCESS",
                message: "user is forbidden"
            });
        }

        const existingUser = await User.findById(userId);
        
        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;
        existingUser.password = password || existingUser.password;
        existingUser.phone = phone || existingUser.phone;

        const updatedUser = existingUser.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "User info upadated successfully",
            newData: updatedUser,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
} 