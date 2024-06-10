import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { 
    deleteAd, 
    getVideo, 
    updateAd, 
    uploadAd 
} from "../controllers/adsController.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'upload')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});

const adRoute = express.Router();

adRoute.post('/create', upload.fields([{name: 'file', maxCount: 1}]), middlewareAuth, uploadAd);
adRoute.get('/', middlewareAuth, getVideo);
adRoute.delete('/delete/:adId', middlewareAuth, deleteAd);
adRoute.put('/update/:adId', upload.fields([{name: 'file', maxCount: 1}]), middlewareAuth, updateAd);

export default adRoute;