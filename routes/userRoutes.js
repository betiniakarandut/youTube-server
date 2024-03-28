import express from 'express';
import { 
    signUp,
    signIn,
    verify, 
    verifyOTP,
    sendOTPVerificationEmailAndSMS,
} from '../controllers/userController.js';
import { facebookSignUp, githubSignUp } from '../controllers/githubFacebookIntegration.js';


const userRoutes = express.Router()

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.post('/sendotpverificationsms', sendOTPVerificationEmailAndSMS)
userRoutes.post('/verifyotp', verifyOTP);
userRoutes.get('/verify/:userId/:uniqueString', verify)
userRoutes.post('/githubsignup', githubSignUp);
userRoutes.post('/facebooksignup', facebookSignUp)

export default userRoutes;