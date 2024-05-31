import PaymentService from '../service/bitpayService.js';

export const createBitPayInvoice = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            res.status(401).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }
        const response = await PaymentService.createInvoice(req.body);
        res.status(201).json({ status: "Success", data: response });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
    }
};

export const getBitPayInvoice = async (req, res) => {
    try {
        userId = req.user._id;
        if(!userId){
            res.status(401).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }
        const response = await PaymentService.getInvoice(req.query.invoiceId);
        res.status(200).json({ status: "Success", data: response });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
    }
};
