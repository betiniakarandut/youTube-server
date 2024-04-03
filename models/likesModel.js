import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
});

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;