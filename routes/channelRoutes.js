import express from "express";
import { 
    createChannel, 
    deleteChannel, 
    subscribeChannel, 
    unSubscribeChannel, 
    updateChannel
} from "../controllers/channelController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const channelRoute = express.Router();

channelRoute.post('/create', middlewareAuth, createChannel);
channelRoute.delete('/:channelId/delete', middlewareAuth, deleteChannel);
channelRoute.put('/:channelId/update', middlewareAuth, updateChannel);
channelRoute.post('/:channelId/subscribe', middlewareAuth, subscribeChannel);
channelRoute.delete('/:channelId/unsubscribe', middlewareAuth, unSubscribeChannel)

export default channelRoute;