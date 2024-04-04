import express from "express";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { 
    comment, 
    updateComment, 
    deleteComment,
} from "../controllers/commentsController.js";

const commentRoute = express.Router();

commentRoute.post('/:videoId', middlewareAuth, comment);
commentRoute.put('/:commentId', middlewareAuth, updateComment);
commentRoute.delete('/:commentId', middlewareAuth, deleteComment);

export default commentRoute;