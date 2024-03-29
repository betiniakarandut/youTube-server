import express from "express";
import multer from "multer";
import { videoUpload } from "../controllers/videoController.js";

const videoRoute = express.Router();

const uploads = multer({dest: 'uploads/'});

videoRoute.post('/uploadvideo', uploads.single('video'), videoUpload);

export default videoRoute;
