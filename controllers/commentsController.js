import Comments from "../models/commentsModel.js";

export const comment = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const videoId = req.params.videoId;
        const { text } = req.body;

        console.log("userId:", userId);
        console.log("videoId:", videoId);
        if (userId || videoId) {
            const newComment = new Comments ({
                videoId,
                userId,
                text,
                createdAt: Date.now(),
            });

            const savedComment = await newComment.save();

            return res.status(200).json({
                status: "SUCCESS!",
                message: "Comment was added successfully",
                commentId: savedComment._id,
                Comment: savedComment.text,
                Time: savedComment.createdAt
            });
        }
        else {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Oops! Something went wrong. Refresh the page"
        });
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
        
        const existingComment = await Comments.findById({_id: commentId});

        if (existingComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                status: "FAILED",
                message: "User is not authorized to update this comment!"
            });
        }

        existingComment.text = req.body.text;

        const saveUpdatedComment = await existingComment.save();
        console.log(saveUpdatedComment);

        res.status(200).json({
            status: "SUCCESS!",
            message: "Comment is updated Successfully",
            text: existingComment.text
        });
    
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
            });
        }

        console.log("Deleted Successfully");
        
        return res.status(200).json({
            status: "Success",
            message:"Comment was deleted successfully",
            timeOfDelete: deletedComment.createdAt,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Oops! Something went wrong. Refresh the page"
        });
    }
    
}

export const likeComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;

        //check if comment or user Id exists
        if (!commentId && !userId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found! Comment or user does not exist"
            });
        }

        // find comment Id or user Id in the comment model
        const existingComment = await Comments.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found! Comment does not exist"
            });
        }

        //check whether user has already liked the comment
        if (existingComment.likes.includes(userId, 1)) {
            return res.status(403).json({
                status: "FAILED",
                message: "User already reacted to this comment"
            });
        }

        //confirm user dont perform both like and dislike operation on any comment
        if(existingComment.dislikes.includes(userId)) {
            return res.status(403).json({
                status: "FAILED",
                message: "User can only Like or Dislike comment"
            })
        }


        // otherwise give a like by incrementing the existing likes to comment
        existingComment.likes += 1;
        existingComment.likes.push(userId);

        await existingComment.save();
        
        return res.status(200).json({
            status: "SUCCESS",
            message: "You Liked this comment",
            likes: existingComment.likes.length,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
        });
    }
    
}

export const unlikeComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;

        //check if comment or user Id exists
        if (!commentId & !userId) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found! Comment or user does not exist"
            });
        }

        //find this comment and user in the DB with commentId
        const existingComment = await Comments.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                status: "FAILED",
                message: "Comment or user does not exist. Check and try again"
            });
        }

        //check whether user has already unliked the comment
        if (existingComment.dislikes.includes(userId)) {
            return res.status(403).json({
                status: "FAILED",
                message: "User already reacted to comment"
            });
        }

        //confirm user dont perform both like and dislike operation on any comment
        if (existingComment.likes.includes(userId)) {
            return res.status(403).json({
                status: "FAILED",
                message: "User can only Like or Dislike comment"
            })
        }
        //else user should unlike comment
        existingComment.dislikes += 1;
        existingComment.dislikes.push(userId);
        await existingComment.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "You Disliked this comment",
            likes: existingComment.dislikes,
        });


    } catch(error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}