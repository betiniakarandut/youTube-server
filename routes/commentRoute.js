import express from "express";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { 
    comment, 
    updateComment, 
    deleteComment,
    likeComment,
    unlikeComment,
    subComments,
    deleteSubComment,
    likeSubComment,
    unLikeSubComment,
} from "../controllers/commentsController.js";

const commentRoute = express.Router();

commentRoute.post('/:videoId', middlewareAuth, comment);
commentRoute.put('/:commentId/update', middlewareAuth, updateComment);
commentRoute.delete('/:commentId/delete', middlewareAuth, deleteComment);
commentRoute.post('/:commentId/like', middlewareAuth, likeComment);
commentRoute.delete('/:commentId/dislike', middlewareAuth, unlikeComment);
commentRoute.post('/:commentId/subcomments', middlewareAuth, subComments);
commentRoute.delete('/subcomments/:subcommentId', middlewareAuth, deleteSubComment);
commentRoute.post('/subcomments/:subcommentId/like', middlewareAuth, likeSubComment);
commentRoute.delete('/subcomments/:subcommentId/unlike', middlewareAuth, unLikeSubComment);

export default commentRoute;