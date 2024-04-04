import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: String, ref: 'Video'},
    likes: {type: Number, default: 0},
});

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;