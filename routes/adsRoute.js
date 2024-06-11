import express from "express";
import multer from "multer";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { 
    deleteAd, 
    getVideo, 
    updateAd, 
    uploadAd 
} from "../controllers/adsController.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'upload')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});

const adRoute = express.Router();

adRoute.post('/create', upload.fields([{name: 'file', maxCount: 1}]), middlewareAuth, uploadAd);
/**
 * @swagger
 * /add/{videoId}:
 *   get:
 *     summary: Display ad by video ID
 *     security:
 *       - BearerAuth: []
 *     description: Auth user can ad
 *     parameters:
 *       - in: path
 *         name: videId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the ad
 *     responses:
 *       200:
 *         description: Successfully display ad
 *       404:
 *         description: ad not found
 *       500:
 *         description: Internal server error
 */
adRoute.get('/:videoId', middlewareAuth, getVideo);
/**
 * @swagger
 * /add/delete/{adId}:
 *   delete:
 *     summary: Delete ad by ID
 *     security:
 *       - BearerAuth: []
 *     description: Auth user can delete ad
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the ad
 *     responses:
 *       200:
 *         description: Successfully leted ad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *       404:
 *         description: ad not found
 *       500:
 *         description: Internal server error
 */
adRoute.delete('/delete/:adId', middlewareAuth, deleteAd);
/**
 * @swagger
 * /add/update/{adId}:
 *   put:
 *     summary: Update fields
 *     security:
 *       - BearerAuth: []
 *     description: Auth user can update ad
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the ad
 *     responses:
 *       200:
 *         description: Successfully leted ad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *       404:
 *         description: ad not found
 *       500:
 *         description: Internal server error
 */
adRoute.put('/update/:adId', middlewareAuth, updateAd);

export default adRoute;