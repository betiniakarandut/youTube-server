import Video from "../models/videoModel.js";
import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
});



export const videoUpload = async (req, res) => {
    try {

        const userId = req.user._id;
        const { title, description, category } = req.body;

        if (title == '' || description == '' || category == '') {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials or fields cannot be empty"
            });
        }

        if (title.length < 5 || title.length > 100 || description.length < 10 || description.length > 500) {
            return res.status(400).json({
                status: "FAILED",
                message: "Title must be between 5 and 100 characters. Description must be between 10 and 500 characters",
            })
        }
        
        if (!userId) {
            return res.status(401).json({
                status: "FAILED",
                message: "User is not authenticated"
            })
        }

        const file = req.files['file'][0];
        if (!file) {
            return res.status(404).json({
                status: "FAILED",
                message: "File not found"
            })
        }

        const result1 = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        console.log(result1)
        // const result2 = await cloudinary.uploader.upload(file2.path, { resource_type: "auto" });

        const newVideo = new Video ({
            title: title,
            description: description,
            creatorId: userId,
            category: category,
            likesCount: 0,
            filePath: result1.secure_url,
            playback: result1.playback_url,
            createdAt: Video.createdAt,
        })

         const savedVideo = await newVideo.save()
         console.log (newVideo);

         res.status(201).json({
            status: "Created!",
            message: "Video was uploaded successfully",
            video: savedVideo,
         });
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "FAILED",
            message: "Failed to upload video"
        });
    }
}
