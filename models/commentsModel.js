import mongoose from "mongoose";
import User from "./userModel";

const commentsSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.ObjectId, ref: User},
    videoId: {type: mongoose.Schema.ObjectId},
    text: String,
    createdAt: Date,
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;