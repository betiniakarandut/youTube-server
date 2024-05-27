import express from "express";
import { 
    createChannel, 
    deleteChannel, 
    subscribeChannel, 
    unSubscribeChannel, 
    updateChannel
} from "../controllers/channelController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const channelRoute = express.Router();

/**
 * @swagger
 * /channel/create:
 *   post:
 *     summary: Create a channel
 *     description: Authenticated user can create/own a channel
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of channel
 *               description:
 *                 type: string
 *                 description: The description of channel
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of this channel
 *                 description:
 *                   type: string
 *                   description: What is this channel all about?
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
channelRoute.post('/create', middlewareAuth, createChannel);
/**
 * @swagger
 * /channel/{channelId}/delete:
 *   delete:
 *     summary: Delete a channel
 *     description: Authenticated user can delete his own channel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *       404:
 *         description: Channel not found
 *       400:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
channelRoute.delete('/:channelId/delete', middlewareAuth, deleteChannel);
/**
 * @swagger
 * /channel/{channelId}/update:
 *   put:
 *     summary: Update a channel
 *     description: Authenticated user can update his channel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of channel
 *               description:
 *                 type: string
 *                 description: The description of channel
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of this channel
 *                 description:
 *                   type: string
 *                   description: What is this channel all about?
 *       400:
 *         description: Channel was not updated
 *       401:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
channelRoute.put('/:channelId/update', middlewareAuth, updateChannel);
/**
 * @swagger
 * /channel/{channelId}/subscribe:
 *   post:
 *     summary: Subscribe to a channel
 *     description: Authenticated user can subscribe to a channel of interest
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *     responses:
 *       200:
 *         description: You successfully to this channel
 *       404:
 *         description: Channel not found
 *       400:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
channelRoute.post('/:channelId/subscribe', middlewareAuth, subscribeChannel);
/**
 * @swagger
 * /channel/{channelId}/subscribe:
 *   delete:
 *     summary: Unsubscribe to a channel
 *     description: Authenticated user can unsubscribe to a channel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *     responses:
 *       200:
 *         description: Unsubscribed!
 *       404:
 *         description: Channel not found
 *       400:
 *         description: Unauthorized - token is required
 *       500:
 *         description: Internal server error
 */
channelRoute.delete('/:channelId/unsubscribe', middlewareAuth, unSubscribeChannel)

export default channelRoute;