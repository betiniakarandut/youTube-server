import PaymentService from "../service/paystackService.js";

const paymentInstance = new PaymentService();

export const startPayment = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            res.status(401).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }
        const response = await paymentInstance.startPayment(req.body);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};

export const makePayment = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            res.status(401).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }
        const response = await paymentInstance.makePayment(req.query);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};

export const getPaymentReceipt = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            res.status(401).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }
        const response = await paymentInstance.paymentReceipt(req.body);
        console.log(response)
        res.status(201).json({ status: "SUCCESS", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "FAILED", message: error.message });
    }
};
