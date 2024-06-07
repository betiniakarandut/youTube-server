import express from "express";
import { 
    getAuthorize,
    getToken,
    postApprove, 
} from "./oauth2Controller.js";

const oauth2Route = express.Router();

/**
 * @swagger
 * /auth/authorize:
 *  get:
 *    summary: A user authorizes third party platform
 *    description: Authorize third party
 *    parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            response_type:
 *              type: string
 *              description: must be 'authorization_code'
 *            client_id:
 *              type: string
 *              description: ID of third party
 *            redirect_uri:
 *              type: string
 *              description: redirect URL
 *            scope:
 *              type: string
 *              description: scope
 *            state:
 *              type: string
 *              description: state
 *    responses:
 *      200:
 *        description: authenticated user authorizes third party
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error
 */
oauth2Route.get('/authorize', getAuthorize);
/**
 * @swagger
 * /auth/approve:
 *  post:
 *    summary: A user approves third party platform
 *    description: Approve third party request to access your data
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              client_id:
 *                type: string
 *                description: ID of third party
 *              redirect_uri:
 *                type: string
 *                description: redirect URL
 *              state:
 *                type: string
 *                description: state
 *    responses:
 *      200:
 *        description: authenticated user approves third party request
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error
 */
oauth2Route.post('/approve', postApprove);
/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Token and access code exchange
 *     description: third party access exchanges code with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grant_type:
 *                 type: string
 *                 description: must be 'authorization_code'
 *               code:
 *                 type: string
 *                 description: access code
 *               redirect_uri:
 *                 type: string
 *                 description: Redirect URL
 *               client_id:
 *                 type: string
 *                 description: ID of third party
 *               client_secret:
 *                 type: string
 *                 description: client secret
 *     responses:
 *       200:
 *         description: third party exchanges token with access code
 *       400:
 *         description: Bad request
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
oauth2Route.get('/token', getToken);

export default oauth2Route;