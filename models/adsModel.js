import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    url: { type: String},
    playback_url: {type: String},
    title: {type: String},
    description: {type: String},
    ad_duration: { type: Number},
    createdAt: {type: Date, default: Date.now}
  });
  
  const Ad = mongoose.model('Ad', adSchema);

  export default Ad;
  