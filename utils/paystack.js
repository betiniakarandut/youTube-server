import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const paystack = () => {
    const MySecretKey = process.env.PAYSTACK_SECRET_KEY;

    const initializePayment = async (form) => {
        try {
            const response = await axios.post('https://api.paystack.co/transaction/initialize', form, {
                headers: {
                    authorization: `Bearer ${MySecretKey}`,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(`Error initializing payment: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const verifyPayment = async (ref) => {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
                headers: {
                    authorization: `Bearer ${MySecretKey}`,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error verifying payment: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return { initializePayment, verifyPayment };
};

export default paystack;
