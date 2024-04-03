import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    text: String,
    createdAt: Date,
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;