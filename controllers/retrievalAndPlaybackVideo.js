import Video from "../models/videoModel.js";
import HLSServer from "hls-server";
import path from "path";

export const playBackVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;

        const video = await Video.findById({_id: videoId});
        if(!video){
            return res.status(404).json({
                status: "FAILED",
                message: "Video not found"
            });
        }
        
        const videoPath = path.join(__dirname, '..', 'videos', video.filename);
        
        return res.status(200).json({
            status: "SUCCESS",
            message: "Video playback"
        });
        res.set('Content-Type', 'Application/vnd.apple.mpegurl');
        res.sendFile(videoPath);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}

export const retrieveVideo = async (req, res) => {
    try {
        const userId = req.body;
        const videoId = req.params.videoId;

        const videos = await Video.findById({_id: videoId});
        if (!videoId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Video not found!"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Retrieved!",
            videos
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}

export const searchVideos = async (req, res) => {
    try {
        const { search } = req.query;
        const video = await Video.find({
            $or: [
                {description: {$regex: new RegExp(search, "i")}},
                {title: {$regex: new RegExp(search, "i")}},
                {videoId: {$regex: new RegExp(search, "i")}},
            ]
        });

        return res.status(200).json({
            status: "SUCCESS",
            message: "videos retrieved successfully",
            video,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}
