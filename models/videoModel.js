import mongoose from "mongoose";

const videoModelSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String,
    creatorId: String,
    videoId: String,
    createdAt: Date,
});

const Video = mongoose.model("Video", videoModelSchema);

export default Video;