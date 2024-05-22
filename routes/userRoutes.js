import express from 'express';
import { 
    signUp,
    signIn,
    verify, 
    verifyOTP,
    sendOTPVerificationEmailAndSMS,
    deleteUser,
} from '../controllers/userController.js';
import { facebookSignUp, githubSignUp } from '../controllers/githubFacebookIntegration.js';
import { middlewareAuth } from '../middlewares/userAuth.js';


const userRoutes = express.Router();

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.post('/sendotpverificationsms', sendOTPVerificationEmailAndSMS);
userRoutes.post('/verifyotp', verifyOTP);
userRoutes.get('/verify/:userId/:uniqueString', verify);
userRoutes.post('/githubsignup', githubSignUp);
userRoutes.post('/facebooksignup', facebookSignUp);
userRoutes.delete('/:deletedUserId/deleteuser', middlewareAuth, deleteUser);

export default userRoutes;