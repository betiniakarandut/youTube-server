import Demographics from "../models/demographicModel.js";
import Video from "../models/videoModel.js";
import dotenv from "dotenv";
import { getWatchedVideos } from "./retrievalAndPlaybackVideo.js";

dotenv.config();

export const getTrendingVideos = async (req, res) => {
    try {
        const trendingVideos = await Video.find({
            createdAt: {$gte: new Date(new Date() - 24 * 60 * 60 * 1000)}
        }).sort('views').limit(10);

        console.log(trendingVideos);
        
        return res.status(200).json({
            status: "SUCCESS",
            message: "Trending videos",
            trendingVideos,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
        });
    }
}

export const getRecommendedVideos = async (req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        
        const userInterest = getUserInterest(user);

        const recommendedVideos = await Video.find(
            {category: {$in: userInterest}}
        ).limit(10);

        if (recommendedVideos.length === 0) {
            return res.status(404).json({
                status: "FAILED",
                message: "No recommended videos found. Try liking or viewing videos of interest."
            });
        }
        

        return res.status(200).json({
            status: "SUCCESS",
            message: "Recommended videos",
            recommendedVideos,
        });
    } catch (error ) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}

const getUserInterest = (user) => {
    try {
        const interest = [];

        user.watchedVideos.forEach(video => {
             interest.push(video.category);       
        });

        return interest;
    } catch (error) {
        console.log(error);
        return "Internal server error"
    }
}