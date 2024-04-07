import mongoose from "mongoose";

const channelModelShema = new mongoose.Schema({
    name: String,
    description: String,
    subcribers: Number,
    creatorId: {type: String, ref: 'User'},
    createdAt: Date,
});

const Channel = mongoose.model("Channel", channelModelShema);

export default Channel;