import mongoose from "mongoose";

const videoMetricsSchema = new mongoose.Schema({
    likes: Number,
    dislikes: Number,
    comments: Number,
    views: Number,
});

const VideoMetrics = mongoose.model('VideoMetrics', videoMetricsSchema);

export default VideoMetrics;