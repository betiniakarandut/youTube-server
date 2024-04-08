import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid"

const channelModelShema = new mongoose.Schema({
    name: String,
    description: String,
    subcribers: Number,
    channelId: {type: String, unique: true,},
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
});

// channelModelShema.pre('save', function generateId(next){
//     if(!this.channel) {
//         this.channelId = uuidv4();
//     }
//     next();
// });
const Channel = mongoose.model("Channel", channelModelShema);

export default Channel;