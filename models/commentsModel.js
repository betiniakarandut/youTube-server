import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    text: String,
    subComments: [{
        text: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now()},
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    }],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdAt: Date,
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;