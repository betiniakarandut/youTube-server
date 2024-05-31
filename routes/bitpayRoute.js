import express from 'express';
import { middlewareAuth } from '../middlewares/userAuth.js';
import { 
    createBitPayInvoice, 
    getBitPayInvoice 
} from '../controllers/bitpayController.js';


const bitpayRoute = express.Router();

/**
 * @swagger
 * /payments/bitpay/invoice:
 *  post:
 *    summary: Creates invoice for a user
 *    security:
 *      - BeaererAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: integer
 *              currency:
 *                type: string
 *              orderId:
 *                type: string
 *              itemDesc:
 *                type: string
 *              buyerEmail:
 *                type: string
 *    responses:
 *      201:
 *        description: Invoice created!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                amount:
 *                  type: integer
 *                currency:
 *                  type: string
 *                orderId:
 *                  type: string
 *                itemDesc:
 *                  type: string
 *                buyerEmail:
 *                  type: string
 *      401:
 *        description: Unauthorized - token expired
 *      500:
 *        description: Failed to create invoice. Error => Token must be required
 */
bitpayRoute.post('/bitpay/invoice', middlewareAuth, createBitPayInvoice);
/**
 * @swagger
 * /payments/bitpay/invoice:
 *  get:
 *    summary: Get Bitpay invoice
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: invoiceId
 *        required: true
 *    responses:
 *      200:
 *        description: Success!
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized - token expired
 *      404:
 *        description: Not found. Cannot retrieve invoice
 *      500:
 *        description: Internal server error
 */
bitpayRoute.get('/bitpay/invoice', middlewareAuth, getBitPayInvoice);

export default bitpayRoute;
