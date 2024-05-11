import mongoose from "mongoose";

const channelModelShema = new mongoose.Schema({
    name: String,
    description: String,
    subcribersCount: {type: Number, default: 0},
    subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
});

const Channel = mongoose.model("Channel", channelModelShema);

export default Channel;