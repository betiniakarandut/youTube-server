import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    url: { type: String},
    title: {type: String},
    description: {type: String},
    duration: { type: Number},
  });
  
  const Ad = mongoose.model('Ad', adSchema);

  export default Ad;
  