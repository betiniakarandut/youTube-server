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
       const videoIds = videos.map(video => video._id);
        console.log(videos);
        console.log(req.user.username);

        // Update user's profile to include the uploaded videos
        const myDashboard = await Dashboard.findOneAndUpdate(
            { userId: userId },
            {
                $set: {username: req.user.username}, 
                $addToSet: {videos: { $each: videoIds } },
            },
            { new: true, upsert: true}
        );

        console.log(myDashboard);

        // if (myDashboard.videos.includes(videos._id)) {
        //     return res.status(400).json({
        //         status: "FAILED",
        //         message: "Already in the list",
        //     });
        // }

        return res.status(200).json({
            status: "SUCCESS",
            message: "User Dashboard created",
            myDashboard: myDashboard,
            numberOfVideos: myDashboard.videos.length,
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
