import express from 'express';
import { 
    startPayment, 
    getPaymentReceipt,
    makePayment
} from '../controllers/paystackController.js';

const paystackRoute = express.Router();

paystackRoute.post('/paystack/startpayment', startPayment);
paystackRoute.get('/paystack/makepayment', makePayment);
paystackRoute.post('/paystack/getreceipt', getPaymentReceipt);

export default paystackRoute;
