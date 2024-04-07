import Video from "../models/videoModel.js";

export const channel = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized or user does not exist"
            });
        }

        const videoLists = new Video({
            description,
            title,
            createdAt,
            filePath,
            userId,
        });

        const savedVideoList = await videoLists.save();

        return res.status(200).json({
            status: "SUCCESS!",
            message : "List of videos in your channel",
            videos: [
                savedVideoList.title, 
                savedVideoList.filePath, 
                savedVideoList.createdAt,
            ] 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}