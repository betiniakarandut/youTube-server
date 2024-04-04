import Video from "../models/videoModel.js";


export const views = async (req, res) => {
    try {

        const videoId = req.params.videoId;
        console.log(`This is req.params.videoId: ${videoId}`)
        const userId = req.user._id;
        console.log(userId)

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorize or user does not exist"
            });
        }
        
        const video = await Video.findOneAndUpdate({_id: videoId});

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
            message: "Viewed",
            views: video.views,
        });
    } catch(erro) {
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        })
    }
}