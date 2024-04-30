import express from "express";
import { retrieveVideo, searchVideos } from "../controllers/retrievalAndPlaybackVideo.js";

const searchRoute = express.Router();

searchRoute.get('/', searchVideos);
searchRoute.get('/:videoId', retrieveVideo);

export default searchRoute;