import express from "express";
import { views } from "../controllers/viewsController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const viewsRoute = express.Router();

/**
 * @swagger
 * /views/{videoId}:
 *  get:
 *    summary: Get views on videos
 *    security:
 *      - BearerAuth: []
 *    description: Authenticated user can see number of views on a particular video
 *    parameters:
 *      - in: path
 *        name: videoId
 *        required: true
 *  responses:
 *    200:
 *      description: Views on video
 *      content:
 *        application/json:
 *          schema:
 *            types: object
 *    404:
 *      description: Video not found
 *    400:
 *      description: Invalid token or token expired
 *    500:
 *      description: Internal server error
 */
viewsRoute.get('/:videoId', middlewareAuth, views);

export default viewsRoute;