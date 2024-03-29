import User from "../models/userModel.js";
import Video from "../models/videoModel.js";


export const videoUpload = async (req, res) => {
    const { title, description } = req.body;
    // check for authenticated user
    if (!User.verified) {
        return res.status(403).json({
            status: "FAILED",
            message: "User is not uthorized"
        })
    } else if (! _id) {
        return res.status(403).json({
            status: "FAILED",
            message: "Invalid user id"
        })
    }

    const newVideo = new Video({
        
        title: title,
        description: description,
        creatorId: req.User._id,
        createdAt: Date.now(),
    })
     
    const savedVideo = await newVideo.save()
    .then((success) => {
        console.log(success);
        return res.status(200).json({
            status: "Success",
            message: "Video was uploaded successfully",
        })
    }).catch((err) => {
        console.log(err);
        return res.status(401).json({
            status: "FAILED",
            message: "Failed to upload video"
        })
    })
}
