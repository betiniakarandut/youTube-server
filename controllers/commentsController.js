import Comments from "../models/commentsModel";

export const comment = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const videoId = req.params.videoId;
        const { text } = req.body;

        const newComment = new Comments ({
            videoId,
            userId,
            text,
            createdAt: Date.now(),
        });

        const saveComment = await newComment.save();

        return res.status(200).json({
            status: "SUCCESS!",
            message: "Comment was added successfully",
            comment: text,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Oops! Something went wrong. Refresh the page"
        })
    }
}

export const updateComment = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const commentId = req.params.commentId;

        if (!userId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Comment not found!"
            });
        }
        
        const existingComment = await Comments.findById({commentId});

        if (existingComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                status: "FAILED",
                message: "User is not authorized to update this comment!"
            })
        }

        existingComment.text = req.body.text;

        const saveUpdatedComment = await existingComment.save();
        console.log(saveUpdatedComment);

        res.status(200).json({
            status: "SUCCESS!",
            message: "Comment is updated Successfully",
            text: existingComment.text
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Oops! Something went wrong. Refresh the page"
        });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentId= req.params.commentId;
        const userId = req.user._id;

        const deletedComment = await Comments.findOneAndDelete({_id: commentId, userId});

        if(!deletedComment) {
            return res.status(400).json({
                status: "FAILED",
                message: "Comment was not found or user is not authorized to delete comment"
            })
        }
        
        return res.status(200).json({
            status: "Success",
            message:"Comment was deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Oops! Something went wrong. Refresh the page"
        });
    }
    
}