import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    text: String,
    subComments: [{
        text: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now()},
        subcommentCount: {type: Number, default: 0},
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
    }],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    likesCount: {type: Number, default: 0},
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikesCount: {type: Number, default: 0},
    createdAt: Date,
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;