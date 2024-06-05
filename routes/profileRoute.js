import express from 'express';
import { middlewareAuth } from '../middlewares/userAuth.js';
import { getUserProfile } from '../controllers/profileController.js';

const profileRoute = express.Router();

profileRoute.get('/', middlewareAuth, getUserProfile);

export default profileRoute;