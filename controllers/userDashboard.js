import Dashboard from "../models/userDashboardModel.js";
import Video from "../models/videoModel.js";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
  });
  

export const userDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }
        
        let videos = await Video.find({ creatorId: userId });

        if (!videos || !videos.length) {
            return res.status(403).json({
                status: "FAILED",
                message: "No videos found for this user"
            });
        }

        // Get only video IDs
        videos = videos.map(video => video._id);

        // Update user's profile to include the uploaded videos
        const userDashboard = await Dashboard.findOneAndUpdate(
            { userId: userId },
            {username: req.user.username},
            { $push: { videos: { $each: videos } } },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            status: "SUCCESS",
            message: "User Dashboard created",
            userProfile: userDashboard,
            numberOfVideos: userProfile.videos.length,
            profileImage: req.file.path,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}
