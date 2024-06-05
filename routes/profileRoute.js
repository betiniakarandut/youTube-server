import express from 'express';
import { middlewareAuth } from '../middlewares/userAuth.js';
import { createUserProfile, deleteProfile, getUserProfile, updateProfile } from '../controllers/profileController.js';

const profileRoute = express.Router();

profileRoute.get('/', middlewareAuth, getUserProfile);
profileRoute.delete('/:profileId', middlewareAuth, deleteProfile);
profileRoute.put('/update', middlewareAuth, updateProfile);
profileRoute.post('/create', middlewareAuth, createUserProfile);

export default profileRoute;