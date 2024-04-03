import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { videoUpload } from "../controllers/videoController.js";

const videoRoute = express.Router();

const uploads = multer({dest: 'uploads/'});

videoRoute.post('/upload:videoId', middlewareAuth, uploads.single('video'), videoUpload);

export default videoRoute;
