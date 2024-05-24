import express from 'express';
const userRoutes = express.Router();

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

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
userRoutes.post('/signup', signUp);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid input
 */
userRoutes.post('/signin', signIn);
userRoutes.post('/sendotpverificationsms', sendOTPVerificationEmailAndSMS);
/**
 * @swagger
 * /user/verifyotp:
 *   post:
 *     summary: verify a user OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userOTPVerification'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid token or expired token 
 */
userRoutes.post('/verifyotp', verifyOTP);
userRoutes.get('/verify/:userId/:uniqueString', verify);
userRoutes.post('/githubsignup', githubSignUp);
userRoutes.post('/facebooksignup', facebookSignUp);
/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: admin can delete a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid input
 */
userRoutes.delete('/:deletedUserId/deleteuser', middlewareAuth, deleteUser);

export default userRoutes;