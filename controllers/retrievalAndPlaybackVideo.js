import Video from "../models/videoModel.js";


export const playBackVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;

        if (!videoId) {
            return res.status(404).json({
                status: "FAILED",
                message: "No video Id"
            });
        }

        const video = await Video.findById({_id: videoId});
        if(!video){
            return res.status(404).json({
                status: "FAILED",
                message: "Video not found"
            });
        }
        
        const videoPlaybackLink = video.playback;

        res.status(200).json({
            status: "SUCCESS",
            message: "Video playback successful",
            videoPlaybackLink
        })

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

export const getWatchedVideos = async (req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;

        // console.log(userId)

        if(!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }

        const watchedVideos = await Video.find({creatorId: userId})
            .sort({views: -1, likes: -1,})
            .limit(10)

        if(watchedVideos.length === 0){
            console.log("Failed");
            res.status(404).json({
                status: "FAILED",
                message: "Not found",
            });
        }
        

        watchedVideos.forEach(video => {
            user.watchedVideos.push(video._id)
        });

        await user.save();
        
        console.log(watchedVideos);
        return res.status(200).json({
            status: "SUCCESS",
            message: "Your watched video list",
            watchedVideos,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}
