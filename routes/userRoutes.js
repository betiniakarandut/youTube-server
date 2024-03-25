import express from 'express';
import { 
    signUp,
    signIn,
    verify, 
    verifyOTP,
    sendOTPVerificationEmailAndSMS,
} from '../controllers/userController.js';


const userRoutes = express.Router()

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.post('/sendotpverificationsms', sendOTPVerificationEmailAndSMS)
userRoutes.post('/verifyotp', verifyOTP);
userRoutes.get('/verify/:userId/:uniqueString', verify)

export default userRoutes;