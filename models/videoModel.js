import mongoose from "mongoose";

const videoModelSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String,
    playback: String,
    creatorId: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now() },
    views: { type: Number, default: 0},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Likes'}],
    likesCount: {type: Number, default: 0, unique: true},
});

const Video = mongoose.model("Video", videoModelSchema);

export default Video;