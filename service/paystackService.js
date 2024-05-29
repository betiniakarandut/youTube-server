import _ from 'lodash';
const { pick } = _;

import Payment from '../models/paystackModel.js';
import paystack from '../utils/paystack.js';

const { initializePayment, verifyPayment } = paystack();

class PaymentService {
    async startPayment(data) {
        try {
            const form = pick(data, ['amount', 'email', 'full_name']);
            form.metadata = { full_name: form.full_name };
            form.amount *= 100;

            const response = await initializePayment(form);
            return response;
        } catch (error) {
            error.source = 'Start Payment Service';
            throw new Error('Error in startPayment: ' + error.message);
        }
    }

    async createPayment(req) {
        const ref = req.reference;
        if (!ref) {
            throw { code: 400, msg: 'No reference passed in query!' };
        }
        try {
            const response = await verifyPayment(ref);
            const { reference, amount, status } = response.data;
            const { email } = response.data.customer;
            const full_name = response.data.metadata.full_name;
            const newPayment = { reference, amount, email, full_name, status };

            const payment = await Payment.create(newPayment);
            return payment;
        } catch (error) {
            console.log(error);
            error.source = 'Create Payment Service';
            throw new Error('Error in createPayment: ' + error.message);
        }
    }

    async paymentReceipt(body) {
        try {
            const reference = body.reference;
            const transaction = await Payment.findOne({ reference });
            return transaction;
        } catch (error) {
            console.log(error);
            error.source = 'Payment Receipt';
            throw new Error('Error in paymentReceipt: ' + error.message);
        }
    }
}

export default PaymentService;
