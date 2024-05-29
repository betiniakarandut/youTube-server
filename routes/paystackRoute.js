import express from 'express';
import { 
    startPayment, 
    createPayment, 
    getPayment 
} from '../controllers/paystackController.js';

const paystackRoute = express.Router();

paystackRoute.post('/paystack/start', startPayment);
paystackRoute.get('/paystack/create', createPayment);
paystackRoute.post('/paystack/get', getPayment);

export default paystackRoute;
