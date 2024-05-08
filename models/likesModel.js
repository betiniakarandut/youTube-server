import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;