import Video from "../models/videoModel.js";
import Ad from "../models/adsModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const getVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.user._id;
  const user = req.user;

  try {
    if (!userId) {
      return res.status(403).send('Unauthorized');
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send({ message: 'Video not found' });
    }

    if (user.isPremium) {
      return res.redirect(video.filePath);
    }

    const ad = await Ad.findOne();
    if (!ad) {
      return res.status(500).send('No ad available');
    }

    res.status(200).send({
      message: 'Ad must be watched',
      adUrl: ad.url,
      adDuration: ad.duration,
      videoUrl: video.filePath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Could not retrieve the video' });
  }
};

export const uploadAd = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, duration } = req.body;
        if (!userId){
          return res.status(403).send('Unauthorized');
        }
        if (!title || !description || description.length < 20 || !duration) {
          return res.status(400).send({
            title: 'ad must have title',
            description: 'ad must have description at least 20 characters',
          });
        }
        const file = req.files['file'][0];
        if(!file){
          return res.status(400).send('Upload a media file for your ad');
        }
        const result = await cloudinary.uploader.upload(file.path, {resource_type: 'auto'});
        console.log(result);

        const newAd = new Ad({
          title:title,
          description:description,
          ad_duration: duration,
          url: result.secure_url,
          playback_url: result.playback_url,
        });
        const savedAd = await newAd.save();
        res.status(201).send({
          message: 'ad created',
          data: savedAd
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}

export const deleteAd = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.admin;
    const adId = req.params.adId;
    if (!userId || !isAdmin){
      return res.status(403).send('Unauthorized');
    }
    if(!adId){
      return res.status(400).send('missing ad ID in params')
    }
    const existingAd = await Ad.findById(adId);
    if(!existingAd){
      return res.status(404).send('Ad not found')
    }
    await Ad.findByIdAndDelete(adId);
    res.status(200).send('Ad deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}

export const updateAd = async(req, res) => {
  try {
    const userId = req.user._id;
    const adId = req.params.adId;
    const { title, description, ad_duration } = req.body;
    if(!userId){
      return res.status(403).send('Unauthorized');
    }
    if (!adId){
      return res.status(400).send('missing ad ID in params')
    }
    const existingAd = await Ad.findOne({ _id: adId });
    if(!existingAd){
      return res.status(404).send('Ad  not found');
    }

    existingAd.title = title || existingAd.title;
    existingAd.description = description || existingAd.description;
    existingAd.duration = ad_duration || existingAd.duration;

    const updatedAd = await existingAd.save();
    res.status(200).send({
      message: 'Ad updated successfully',
      newData: updatedAd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}