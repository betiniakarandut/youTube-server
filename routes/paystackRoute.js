import express from 'express';
import { middlewareAuth } from '../middlewares/userAuth.js';
import { 
    startPayment, 
    getPaymentReceipt,
    makePayment
} from '../controllers/paystackController.js';

const paystackRoute = express.Router();

/**
 * @swagger
 * /payments/paystack/startpayment:
 *   post:
 *     summary: Initialize a payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               amount:
 *                 type: integer
 *               full_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authorization_url:
 *                   type: string
 *                 access_code:
 *                   type: string
 *                 reference:
 *                   type: string
 *       401:
 *         description: Unauthorized - token expired
 *       500:
 *         description: Server error
 */
paystackRoute.post('/paystack/startpayment', middlewareAuth, startPayment);
/**
 * @swagger
 * /payments/paystack/verify:
 *   get:
 *     summary: Verify a payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       201:
 *         description: Payment successfully created and verified
 *       401:
 *         description: Unauthorized - token expired
 *       500:
 *         description: Server error
 */
paystackRoute.get('/paystack/verify', middlewareAuth, makePayment);
/**
 * @swagger
 * /payments/paystack/receipt:
 *   post:
 *     summary: Generates a payment receipt
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: string
 *       401:
 *         description: Unauthorized - token expired
 *       500:
 *         description: Server error
 */
paystackRoute.post('/paystack/receipt', middlewareAuth, getPaymentReceipt);

export default paystackRoute;
