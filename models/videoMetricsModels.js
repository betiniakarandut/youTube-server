import mongoose from "mongoose";

const videoMetricsSchema = new mongoose.Schema({
    likes: Number,
    dislikes: Number,
    comments: Number,
    views: Number,
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    createdAt: {type: Date, default: Date.now()},
});

const VideoMetrics = mongoose.model('VideoMetrics', videoMetricsSchema);

export default VideoMetrics;