import express from 'express';
import {
    likeVideo, 
    unlikeVideo 
} from '../controllers/likesController.js';
import { middlewareAuth } from '../middlewares/userAuth.js';

const likeRoute = express.Router();

likeRoute.post('/:videoId/like', middlewareAuth, likeVideo);
likeRoute.delete('/:videoId/unlike', middlewareAuth, unlikeVideo);

export default likeRoute;