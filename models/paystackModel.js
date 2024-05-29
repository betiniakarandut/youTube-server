import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
