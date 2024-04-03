import express from 'express';
import {
    likeVideo, 
    unlikeVideo 
} from '../controllers/likesController';
import { middlewareAuth } from '../middlewares/userAuth';

const likeRoute = express.Router();

likeRoute.post('/:videoId/like', middlewareAuth, likeVideo);
likeRoute.delete('/:videoId/unlike', middlewareAuth, unlikeVideo);

export default likeRoute;