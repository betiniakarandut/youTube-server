import mongoose from "mongoose";

const channelModelShema = new mongoose.Schema({
    name: String,
    description: String,
    subcribers: Number,
    channelId: {type: String, unique: true,},
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
});

const Channel = mongoose.model("Channel", channelModelShema);

export default Channel;