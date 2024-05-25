import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { videoUpload } from "../controllers/videoController.js";
import { pagination } from "../controllers/videoPagination.js";
import { getWatchedVideos, playBackVideo, retrieveVideo } from "../controllers/retrievalAndPlaybackVideo.js";
import { getRecommendedVideos, getTrendingVideos } from "../controllers/trendingVideos.js";
import { getEngagementMetrics, getVideoMetrics } from "../controllers/videoMetricsController.js";

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
videoRoute.get('/playback/:videoId', playBackVideo)
videoRoute.get('/trending', getTrendingVideos);
videoRoute.get('/watched', middlewareAuth, getWatchedVideos);
videoRoute.get('/recommended', middlewareAuth, getRecommendedVideos);
videoRoute.get('/:videoId/analytics/metrics', middlewareAuth, getVideoMetrics);
videoRoute.get('/:videoId/analytics/engagements', getEngagementMetrics);

export default videoRoute;
