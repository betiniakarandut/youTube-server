import Video from "../models/videoModel.js";


export const videoUpload = async (req, res) => {
    try {

        const userId = req.user._id;
        const { title, description } = req.body;

        if (title == '' || description == '') {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials or fields cannot be empty"
            });
        }

        if (title.length < 5 || title.length > 100 || description.length < 10 || description.length > 500) {
            return res.status(400).json({
                status: "FAILED",
                message: "Title must be between 5 and 100 characters. Description must be between 10 and 500 characters",
            })
        }
        
        if (!userId) {
            return res.status(401).json({
                status: "FAILED",
                message: "User is not authenticated"
            })
        }

        const newVideo = new Video ({
            title: title,
            description: description,
            creatorId: userId,
            createdAt: Video.createdAt,
        })

         const savedVideo = await newVideo.save()
         console.log (newVideo);

         res.status(201).json({
            status: "Created!",
            message: "Video was uploaded successfully",
            video: savedVideo.filePath,
            videoId: savedVideo._id,
            Time: savedVideo.createdAt,
         });
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "FAILED",
            message: "Failed to upload video"
        });
    }
}
