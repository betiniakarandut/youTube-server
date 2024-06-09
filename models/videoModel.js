import mongoose from "mongoose";

const videoModelSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    filePath: {type: String, required: true},
    playback: String,
    creatorId: String,
    category: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
    commentCount: {type: Number, default: 0},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now() },
    viewsId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    views: { type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Likes'}],
    likesCount: {type: Number, default: 0},
});

const Video = mongoose.model("Video", videoModelSchema);

export default Video;