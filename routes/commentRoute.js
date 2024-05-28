import express from "express";
import { middlewareAuth } from "../middlewares/userAuth.js";
import { 
    comment, 
    updateComment, 
    deleteComment,
    likeComment,
    unlikeComment,
    subComments,
    deleteSubComment,
    likeSubComment,
    unLikeSubComment,
} from "../controllers/commentsController.js";

const commentRoute = express.Router();

/**
 * @swagger
 * /comments/{videoId}:
 *  post:
 *    summary: Comment on a video
 *    description: Authenticated user is able to comment on any video
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        required: true
 *        schema:
 *          type: string
 *          description: Add your comment here
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *                description: start comment
 *    responses:
 *      201:
 *        description: Comment successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      400:
 *        description: Failed to add comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.post('/:videoId', middlewareAuth, comment);
/**
 * @swagger
 * /comments/{commentId}/update:
 *  put:
 *    summary: Comment on a video
 *    description: Authenticated user is able to comment on any video
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: commentId
 *        required: true
 *        schema:
 *          type: string
 *          description: Add your comment here
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *                description: start comment
 *    responses:
 *      201:
 *        description: Comment successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      400:
 *        description: Failed to add comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.put('/:commentId/update', middlewareAuth, updateComment);
/**
 * @swagger
 * /comments/{commentId}/delete:
 *  delete:
 *    summary: Comment on a video
 *    description: Authenticated user is able to comment on any video
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: commentId
 *        required: true
 *    responses:
 *      201:
 *        description: Comment deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      404:
 *        description: Comment not found.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.delete('/:commentId/delete', middlewareAuth, deleteComment);
/**
 * @swagger
 * /comments/{commentId}/like:
 *  post:
 *    summary: Like a comment on any video
 *    description: Authenticated user is able to like comment
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: commentId
 *        required: true
 *    responses:
 *      201:
 *        description: You liked this comment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      404:
 *        description: Comment not found.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.post('/:commentId/like', middlewareAuth, likeComment);
commentRoute.delete('/:commentId/dislike', middlewareAuth, unlikeComment);
/**
 * @swagger
 * /comments/{commentId}/subcomments:
 *  post:
 *    summary: Sub-comment on a video
 *    description: Authenticated user is able to make sub-comments
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: CommentId
 *        required: true
 *        schema:
 *          type: string
 *          description: Add your comment here
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *                description: start comment
 *    responses:
 *      201:
 *        description: Comment successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      400:
 *        description: Failed to add comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.post('/:commentId/subcomments', middlewareAuth, subComments);
/**
 * @swagger
 * /comments/subcomments/{subcommentId}:
 *  delete:
 *    summary: Deletes a sub-comment on a video
 *    description: Authenticated user is able to delete his sub-comments
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: CommentId
 *        required: true
 *    responses:
 *      201:
 *        description: Comment deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  description: Add your comment here
 *      400:
 *        description: Failed to delete comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.delete('/subcomments/:subcommentId', middlewareAuth, deleteSubComment);
/**
 * @swagger
 * /comments//subcomments/{subcommentId}/like:
 *  post:
 *    summary: Like a sub-comment on a video
 *    description: Authenticated user is able to like a sub-comment
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: CommentId
 *        required: true
 *    responses:
 *      201:
 *        description: You liked this comment successfully
 *      400:
 *        description: Failed to like comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.post('/subcomments/:subcommentId/like', middlewareAuth, likeSubComment);
/**
 * @swagger
 * /comments//subcomments/{subcommentId}/unlike:
 *  delete:
 *    summary: Unlike a sub-comment on a video
 *    description: Authenticated user is able to unlike a sub-comment
 *    security:
 *      - BearerAuth: []
 *    paramenters:
 *      - in: path
 *        name: CommentId
 *        required: true
 *    responses:
 *      201:
 *        description: You unliked this comment successfully
 *      400:
 *        description: Failed to unroutes/commentRoute.js like comment.
 *      401:
 *        description: Unauthorized - token is required
 *      500:
 *        description: Internal server error
 */
commentRoute.delete('/subcomments/:subcommentId/unlike', middlewareAuth, unLikeSubComment);

export default commentRoute;