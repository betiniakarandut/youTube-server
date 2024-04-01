import Likes from "../models/likesModel";

export const likeVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.user._id;

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthenticated! You must sign in or sign up."
            });
        }
        
        const existingLike = await Likes.findOne({userId, videoId});
        if (existingLike) {
            return res.status(200).json({
                status: "Success",
                message: "You already liked this video"
            })
        }

        const newLike = new Likes ({
            userId,
            videoId,
        });

        const saveLike = await newLike.save();
        return res.status(200).json({
            status: "Success!",
            message: "Sucessfully liked video"
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
        const likeId = req.params.likeId

        if (!likeId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found"
            });
        }

        await Likes.findByIdAndDelete({likeId});

        return res.status(200).json({
            status: "SUCCESS",
            message: "You successfully unlike this video"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "FAILED",
            message: "Oop! Something went wrong. Try again!!"
        })
    }
}