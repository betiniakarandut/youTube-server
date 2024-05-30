import PayoutException from './PayoutException';
export declare class PayoutUpdateException implements PayoutException {
    readonly message: string;
    readonly name: string;
    readonly code: number;
    readonly stack: string;
    readonly apiCode: string;
    /**
     * Construct the PayoutUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message: string, apiCode?: string);
}
export default PayoutUpdateException;
