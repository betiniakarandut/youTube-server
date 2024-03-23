import express from 'express';
import { signUp, signIn, verify } from '../controllers/userController.js';


const userRoutes = express.Router()

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.get('/verify/:userId/:uniqueString', verify)

export default userRoutes;