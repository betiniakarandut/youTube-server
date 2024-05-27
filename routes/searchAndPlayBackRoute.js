import express from "express";
import { retrieveVideo, searchVideos } from "../controllers/retrievalAndPlaybackVideo.js";

const searchRoute = express.Router();


/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search videos based on key words
 *     description: Get details of a video specified by the videoId parameter.
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: search video by typing any character that matches video of choice
 *     responses:
 *       200:
 *         description: Successful
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
searchRoute.get('/', searchVideos);
/**
 * @swagger
 * /search/{videoId}:
 *   get:
 *     summary: Retrieve a single video by ID
 *     security:
 *       - BearerAuth: []
 *     description: Get details of a video specified by the videoId parameter.
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
searchRoute.get('/:videoId', retrieveVideo);

export default searchRoute;