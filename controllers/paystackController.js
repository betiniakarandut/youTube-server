import PaymentService from "../service/paystackService.js";

const paymentInstance = new PaymentService();

export const startPayment = async (req, res) => {
    try {
        const response = await paymentInstance.startPayment(req.body);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};

export const createPayment = async (req, res) => {
    try {
        const response = await paymentInstance.createPayment(req.query);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};

export const getPayment = async (req, res) => {
    try {
        const response = await paymentInstance.paymentReceipt(req.body);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};
