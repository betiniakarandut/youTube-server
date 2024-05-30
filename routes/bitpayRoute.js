import express from 'express';
import { 
    createBitPayInvoice, 
    getBitPayInvoice 
} from '../controllers/bitpayController.js';

const bitpayRoute = express.Router();

bitpayRoute.post('/bitpay/invoice', createBitPayInvoice);
bitpayRoute.get('/bitpay/invoice', getBitPayInvoice);

export default bitpayRoute;
