import express from 'express';
import { signUp, signIn } from '../controllers/userController.js';


const userRoutes = express.Router()

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);

export default userRoutes;