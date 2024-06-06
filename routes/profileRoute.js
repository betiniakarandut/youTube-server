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

/**
 * @swagger
 * /profile:
 *  get:
 *    summary: fetch user profile
 *    description: Fetches the current user profile
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User profile retrieved successfully
 *      404:
 *        description: User profile not found
 *      500:
 *        description: Internal server error
 */
profileRoute.get('/', middlewareAuth, getUserProfile);
/**
 * @swagger
 * /profile/{profileId}:
 *  delete:
 *    summary: Delete user profile
 *    description: Authenticated user is able to delete his profile
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: profileId
 *        required: true
 *    responses:
 *      200:
 *        description: Profile completely deleted from database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                profileId:
 *                  type: string
 *                  description: paramenters
 *      404:
 *        description: Profile not found.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
profileRoute.delete('/:profileId', middlewareAuth, deleteProfile);
/**
 * @swagger
 * /profile/{profileId}/update:
 *   put:
 *     summary: Updates a profile
 *     description: Auth user is able to update profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture to upload
 *               full_name:
 *                 type: string
 *                 description: User's full name
 *               address:
 *                 type: string
 *                 description: User's residence address
 *               zip_code:
 *                 type: string
 *                 description: User country zip code
 *               maiden_name:
 *                 type: string
 *                 description: User maiden name
 *               hobby:
 *                 type: string
 *                 description: User's hobby
 *               bio:
 *                 type: string
 *                 description: User bio must be > 50 characters
 *               date_of_birth:
 *                 type: string
 *                 description: user date of birth (yyy/dd/mm)
 *               gender:
 *                 type: string
 *                 description: User gender
 *               country:
 *                 type: object
 *                 description: label, currency, code
 *               nationality:
 *                 type: string
 *                 description: User nationality
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                   description: User's full name
 *                 address:
 *                   type: string
 *                   description: User's residential address
 *                 zip_code:
 *                   type: string
 *                   description: User country zip code
 *                 maiden_name:
 *                   type: string
 *                   description: User maiden name
 *                 hobby:
 *                   type: string
 *                   description: User hobby
 *                 bio:
 *                   type: string
 *                   description: User bio must be >50 characters
 *                 date_of_birth:
 *                   type: string
 *                   description: User date of birth
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: User profile image
 *                 gender:
 *                   type: string
 *                   description: User gender
 *                 country:
 *                   type: object
 *                   description: label, currency, code
 *                 nationality:
 *                   type: string
 *                   description: User nationality
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
profileRoute.put('/:profileId/update', middlewareAuth, updateProfile);
/**
 * @swagger
 * /profile/create:
 *   post:
 *     summary: Creates a new profile
 *     description: Creates a new user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture to upload
 *               full_name:
 *                 type: string
 *                 description: User's full name
 *               address:
 *                 type: string
 *                 description: User's residence address
 *               zip_code:
 *                 type: string
 *                 description: User country zip code
 *               maiden_name:
 *                 type: string
 *                 description: User maiden name
 *               hobby:
 *                 type: string
 *                 description: User's hobby
 *               bio:
 *                 type: string
 *                 description: User bio must be > 50 characters
 *               date_of_birth:
 *                 type: string
 *                 description: user date of birth (yyy/dd/mm)
 *               gender:
 *                 type: string
 *                 description: User gender
 *               country:
 *                 type: object
 *                 description: label, currency, code
 *               nationality:
 *                 type: string
 *                 description: User nationality
 *     responses:
 *       201:
 *         description: User profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                   description: User's full name
 *                 address:
 *                   type: string
 *                   description: User's residential address
 *                 zip_code:
 *                   type: string
 *                   description: User country zip code
 *                 maiden_name:
 *                   type: string
 *                   description: User maiden name
 *                 hobby:
 *                   type: string
 *                   description: User hobby
 *                 bio:
 *                   type: string
 *                   description: User bio must be >50 characters
 *                 date_of_birth:
 *                   type: string
 *                   description: User date of birth
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: User profile image
 *                 gender:
 *                   type: string
 *                   description: User gender
 *                 country:
 *                   type: object
 *                   description: label, currency, code
 *                 nationality:
 *                   type: string
 *                   description: User nationality
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
profileRoute.post('/create', upload.fields([{ name: 'file', maxCount: 1 }]), middlewareAuth, createUserProfile);

export default profileRoute;