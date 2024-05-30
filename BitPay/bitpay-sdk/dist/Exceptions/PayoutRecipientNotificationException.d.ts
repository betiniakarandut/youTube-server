import PayoutRecipientException from './PayoutRecipientException';
export declare class PayoutRecipientNotificationException implements PayoutRecipientException {
    readonly message: string;
    readonly name: string;
    readonly code: number;
    readonly stack: string;
    readonly apiCode: string;
    /**
     * Construct the PayoutRecipientNotificationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message: string, apiCode?: string);
}
export default PayoutRecipientNotificationException;
