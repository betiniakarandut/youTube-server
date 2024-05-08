import Likes from "../models/likesModel.js";
import Video from "../models/videoModel.js";

export const likeVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        // console.log(`This is video Id of likes controller: ${videoId}`);
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

        if(existingVideo.likes.includes(userId)) {
            return res.status(200).json({
                status: "SUCCESS",
                message: "User already liked video"
            })
        }

        console.log("Is working")

        existingVideo.likes.push(userId);
        existingVideo.likesCount += 1;
        await existingVideo.save();

        return res.status(200).json({
            status: "Success!",
            message: "Sucessfully liked video",
            likes: existingVideo.likesCount,
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
        const videoId = req.params.videoId;
        // console.log(`This is video Id of likes controller: ${videoId}`);
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

        if(!existingVideo.likes.includes(userId)) {
            return res.status(200).json({
                status: "SUCCESS",
                message: "User has not liked video"
            })
        }

        console.log("Is working")

        existingVideo.likes.pop(userId);
        existingVideo.likesCount -= 1;
        await existingVideo.save();

        return res.status(200).json({
            status: "Success!",
            message: "Sucessfully unliked video",
            likes: existingVideo.likesCount,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: `Internal server error ${error}`
        });
    }
}
