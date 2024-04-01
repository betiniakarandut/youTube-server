import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: User},
    videoId: {type: mongoose.Schema.ObjectId, ref: Video},
});

const Likes = mongoose.model("Likes", likesSchema)

export default Likes;