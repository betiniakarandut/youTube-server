import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { videoUpload } from "../controllers/videoController.js";
import { pagination } from "../controllers/videoPagination.js";
import { getWatchedVideos, playBackVideo, retrieveVideo } from "../controllers/retrievalAndPlaybackVideo.js";
import { getRecommendedVideos, getTrendingVideos } from "../controllers/trendingVideos.js";
import { getEngagementMetrics, getVideoMetrics } from "../controllers/videoMetricsController.js";
import { getDownloads, getHistory } from "../controllers/history.js";

const videoRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});


/**
 * @swagger
 * /video/upload:
 *   post:
 *     summary: Upload a new video
 *     description: Upload a video file along with metadata.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The video file to upload
 *               title:
 *                 type: string
 *                 description: The title of the video
 *               description:
 *                 type: string
 *                 description: The description of the video
 *               category:
 *                 type: string
 *                 description: The category of the video
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the uploaded video
 *                 description:
 *                   type: string
 *                   description: The description of the uploaded video
 *                 url:
 *                   type: string
 *                   description: The URL of the uploaded video
 *                 uploadDate:
 *                   type: string
 *                   format: date-time
 *                   description: The upload date of the video
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
videoRoute.post('/upload', upload.fields([{name:'file', maxCount: 1 }]), middlewareAuth, videoUpload);

/**
 * @swagger
 * /video/pagination:
 *   get:
 *     summary: Paginate video display
 *     responses:
 *       200:
 *         description: successful! 9 videos per page
 *       400:
 *         description: Bad request
 */
videoRoute.get('/pagination', pagination);
/**
 * @swagger
 * /video/playback/{videoId}:
 * get:
 *  summary: video playback
 *  security:
 *    - BearerAuth: []
 *  description: Playback video of given video ID
 *  parameters:
 *    - in: path
 *      name: videoId
 *      required: true
 *      schema:
 *        type: string
 *        description: The ID of the video to playback
 *  responses:
 *    200:
 *      description: Video playback URL successful
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              videoId:
 *                type: string
 *    404:
 *      description: Video not found
 *    500:
 *      description: Internal server error
 */
videoRoute.get('/playback/:videoId', playBackVideo);
/**
 * @swagger
 * /video/trending:
 *  get:
 *    summary: Get trending videos
 *    description: Videos within 24hr of upload
 *  responses:
 *    200:
 *      description: Trending videos
 *      content:
 *        application/json:
 *          schema:
 *            types: object
 *    500:
 *      description: Internal server error
 */
videoRoute.get('/trending', getTrendingVideos);
/**
 * @swagger
 * /video/watched:
 *  get:
 *    summary: Get a user video watched list
 *    description: Authenticated user is able to see his watchlist
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Watched list displayed
 *      400:
 *        description: Failed to retrieve watch list.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
videoRoute.get('/watched', middlewareAuth, getWatchedVideos);
/**
 * @swagger
 * /video/recommended:
 *  get:
 *    summary: Recommend video for user
 *    description: Video Recommendation
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Your recommended videos
 *      400:
 *        description: Failed to retrieve recommended videos.
 *      401:
 *        description: Unauthorized - token is required
 *      404:
 *        description: No recommendations yet
 *      500:
 *        description: Internal server error
 */
videoRoute.get('/recommended', middlewareAuth, getRecommendedVideos);
videoRoute.get('/:videoId/analytics/metrics', middlewareAuth, getVideoMetrics);
videoRoute.get('/:videoId/analytics/engagements', getEngagementMetrics);
/**
 * @swagger
 * /video/download/{videoId}:
 *   get:
 *     summary: Video download
 *     security:
 *       - BearerAuth: []
 *     description: Authenticated user can Download a video
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to download
 *     responses:
 *       200:
 *         description: Successfully downloaded video
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
videoRoute.get('/download/:videoId', middlewareAuth, getDownloads);
/**
 * @swagger
 * /video/history:
 *   get:
 *     summary: Video download and playlist history
 *     security:
 *       - BearerAuth: []
 *     description: Authenticated user can see download and playlist history
 *     responses:
 *       200:
 *         description: History
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
videoRoute.get('/history', middlewareAuth, getHistory);

export default videoRoute;
