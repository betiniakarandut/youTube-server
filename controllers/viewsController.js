import Video from "../models/videoModel.js";


export const views = async (req, res) => {

    const videoId = req.params.videoId;
    const userId = req.user._id;

    if (!userId) {
        return req.status(403).json({
            status: "FAILED",
            message: "Unauthorize or user does not exist"
        });
    }
    
    const video = await Video.findOneAndUpdate({videoId});

    if (!video) {
        return res.status(404).json({
            status: "FAILED",
            message: "Video not found"
        })
    }

    video.views += 1;

    video.save();

    return res.status(200).json({
        status: "SUCCESS",
        message: "Viewed"
    });
}