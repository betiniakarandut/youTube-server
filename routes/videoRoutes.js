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
 *     summary: Verified user can upload a video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Video'
 *     responses:
 *       200:
 *         description: Video uploaded successfully
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
