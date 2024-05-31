import express from 'express';
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
bitpayRoute.post('/bitpay/invoice', createBitPayInvoice);
bitpayRoute.get('/bitpay/invoice', getBitPayInvoice);

export default bitpayRoute;
