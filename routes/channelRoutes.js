import express from "express";
import { 
    channel, 
    deleteChannel, 
    updateChannel
} from "../controllers/channelController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const channelRoute = express.Router();

channelRoute.post('/', middlewareAuth, channel);
channelRoute.delete('/:channelId/delete', middlewareAuth, deleteChannel);
channelRoute.put('/:channelId/update', middlewareAuth, updateChannel);

export default channelRoute;