import bitpayClient from '../utils/bitpay.js';

class PaymentService {
    async createInvoice(data) {
        const invoiceData = {
            price: data.amount,
            currency: 'USD',
            orderId: data.orderId,
            itemDesc: data.itemDesc,
            buyerEmail: data.email,
        };

        try {
            const invoice = await bitpayClient.createInvoice(invoiceData);
            console.log(invoice)
            return invoice;
        } catch (error) {
            throw new Error('Failed to create BitPay invoice: ' + error.message);
        }
    }

    async getInvoice(invoiceId) {
        try {
            const invoice = await bitpayClient.getInvoice(invoiceId);
            return invoice;
        } catch (error) {
            throw new Error('Failed to get BitPay invoice: ' + error.message);
        }
    }
}

export default new PaymentService();
