import Likes from "../models/likesModel.js";
import Video from "../models/videoModel.js";

export const likeVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        console.log(`This is video Id of likes controller: ${videoId}`);
        const userId = req.user._id;

        // does video Id exists?
        const existingVideo = await Video.findById(videoId);
        if (!existingVideo) {
            return res.status(404).json({
                status: "FAILED",
                message: "Video not found"
            });
        }

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthenticated! You must sign in or sign up."
            });
        }
        
        const existingLike = await Likes.findOne({userId, videoId});
        if (existingLike) {
            return res.status(200).json({
                status: "SUCCESS",
                message: "You already liked this video"
            })
        }

        const newLike = new Likes ({
            userId,
            videoId,
            likes: 1,
        });

        const savedLike = await newLike.save();
        return res.status(200).json({
            status: "Success!",
            message: "Sucessfully liked video",
            likes: savedLike.likes,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: `Internal server error ${error}`
        });
    }
}


export const unlikeVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId

        if (!videoId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found"
            });
        }

        await Likes.findByIdAndDelete(videoId);

        return res.status(200).json({
            status: "SUCCESS",
            message: "You successfully unlike this video"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "FAILED",
            message: "Oop! Something went wrong. Try again!!"
        });
    }
}