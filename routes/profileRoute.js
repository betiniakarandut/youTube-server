import express from 'express';
import multer from 'multer';
import { middlewareAuth } from '../middlewares/userAuth.js';
import { 
    createUserProfile, 
    deleteProfile, 
    getUserProfile, 
    updateProfile 
} from '../controllers/profileController.js';

const profileRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});

profileRoute.get('/', middlewareAuth, getUserProfile);
profileRoute.delete('/:profileId', middlewareAuth, deleteProfile);
profileRoute.put('/:profileId/update', middlewareAuth, updateProfile);
profileRoute.post('/create', upload.fields([{ name: 'file', maxCount: 1 }]), middlewareAuth, createUserProfile);

export default profileRoute;