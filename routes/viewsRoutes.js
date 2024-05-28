import express from "express";
import { views } from "../controllers/viewsController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const viewsRoute = express.Router();

/**
 * @swagger
 * /views/{videoId}:
 *  get:
 *    summary: Get the number of views on a particular video
 *    description: Authenticated user is able vieww
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        required: true
 *    responses:
 *      200:
 *        description: views successful
 *      400:
 *        description: Failed to retrieve views.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
viewsRoute.get('/:videoId', middlewareAuth, views);

export default viewsRoute;