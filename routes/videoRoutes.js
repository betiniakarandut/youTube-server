import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { videoUpload } from "../controllers/videoController.js";
import { pagination } from "../controllers/videoPagination.js";
import { getWatchedVideos, playBackVideo } from "../controllers/retrievalAndPlaybackVideo.js";
import { getRecommendedVideos, getTrendingVideos } from "../controllers/trendingVideos.js";
import { getEngagementMetrics, getVideoMetrics } from "../controllers/videoMetricsController.js";

const videoRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});

videoRoute.post('/upload', upload.fields([{name:'file', maxCount: 1 }]), middlewareAuth, videoUpload);
videoRoute.get('/pagination', pagination);
videoRoute.get('/playback/:videoId', playBackVideo)
videoRoute.get('/trending', getTrendingVideos);
videoRoute.get('/watched', middlewareAuth, getWatchedVideos);
videoRoute.get('/recommended', middlewareAuth, getRecommendedVideos);
videoRoute.get('/:videoId/analytics/metrics', middlewareAuth, getVideoMetrics);
videoRoute.get('/:videoId/analytics/engagements', getEngagementMetrics);

export default videoRoute;
