import mongoose from "mongoose";

const videoModelSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String,
    creatorId: String,
    createdAt: Date,
    views: Number,
    comments: String,
    likes: Number,
});

const Video = mongoose.model("Video", videoModelSchema);

export default Video;