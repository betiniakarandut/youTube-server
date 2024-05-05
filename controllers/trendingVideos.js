import Video from "../models/videoModel.js";

export const getTrendingVideos = async (req, res) => {
    try {
        const trendingVideos = await Video.find({
            createdAt: {$gte: new Date(new Date() - 24 * 60 * 60 * 1000)}
        }).sort('_id').limit(10);
        
        return res.status(200).json({
            status: "SUCCESS",
            message: "Trending videos",
            trendingVideos,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
        });
    }
}