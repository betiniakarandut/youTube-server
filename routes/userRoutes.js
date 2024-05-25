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
 *     summary: Sign up a new user
 *     description: User signup process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username
 *               email:
 *                 type: string
 *                 description: User email address
 *               phone:
 *                 type: number
 *                 description: User phone number
 *               password:
 *                 type: string
 *                 description: Enter at least 8 characters password
 *     responses:
 *       200:
 *         description: Successful! OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username
 *                 email:
 *                   type: string
 *                   description: User email address
 *                 phone:
 *                   type: number
 *                   description: User phone number
 *                 password:
 *                   type: string
 *                   description: Enter at least 8 characters password
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
userRoutes.post('/signup', signUp);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */  
userRoutes.post('/signin', signIn);
userRoutes.post('/sendotpverificationsms', sendOTPVerificationEmailAndSMS);
/**
 * @swagger
 * /user/verifyotp:
 *   post:
 *     summary: Verify user OTP
 *     description: User must supply OTP to be verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*                 description: The user ID
*               otp:
*                 type: string
*                 description: OTP received
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User ID
 *                 otp:
 *                   type: string
 *                   description: The OTP sent to phone and email
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
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