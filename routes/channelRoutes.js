import express from "express";
import { channel } from "../controllers/channelController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const channelRoute = express.Router();

channelRoute.get('/:channelId', middlewareAuth, channel);

export default channelRoute;