import VideoMetrics from "../models/videoMetricsModels.js";
import Video from "../models/videoModel.js";

export const getVideoMetrics = async(req, res) => {
    try {
        const userId = req.user._id;
        const videoId = req.params.videoId;
        
        if(!userId){
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }

        const isVideo = await Video.findOne({_id: videoId});
        if(!isVideo){
            return res.status(404).json({
                status: "FAILED",
                message: "video not found"
            });
        }

        const countViews = isVideo.views;
        const countLikes = isVideo.likes;
        const countComments = isVideo.comments;

        const metrics = new VideoMetrics({
            likes: countLikes,
            comments: countComments,
            views: countViews,
        });

        const savedMetrics = await metrics.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Video Metrics",
            savedMetrics,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}

export const getEngagementMetrics = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        
        const isVideo = await VideoMetrics.findOne({_id: videoId});
        if(!isVideo){
            return res.status(404).json({
                status: "FAILED",
                message: "video not found"
            });
        }
        
        const totalEngagement = isVideo.likes + isVideo.comments;
        const totalViews = isVideo.views;

        const Engagementmentric = (totalEngagement/totalViews) * 100

        return res.status(200).json({
            status: "SUCCESS",
            message: "Video Engagements",
            Engagementmentric
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}