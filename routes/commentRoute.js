import express from "express";
import { middlewareAuth } from "../middlewares/userAuth";
import { 
    comment, 
    updateComment, 
    deleteComment,
} from "../controllers/commentsController";

commentRoute = express.Router();

commentRoute.post('/:commentId', middlewareAuth, comment);
commentRoute.update('/:commentId', middlewareAuth, updateComment);
commentRoute.delete('/:commentId', middlewareAuth, deleteComment);

export default commentRoute;