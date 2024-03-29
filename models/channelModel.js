import mongoose from "mongoose";

const channelModelShema = new mongoose.Schema({
    name: String,
    description: String,
    subcribers: Number,
    creatorId: String,
    createdAt: Date,
});

const Channel = mongoose.model("Channel", channelModelShema);

export default Channel;