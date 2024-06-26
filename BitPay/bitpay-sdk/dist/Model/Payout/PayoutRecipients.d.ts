import { PayoutRecipient } from './PayoutRecipient';
export interface PayoutRecipientsInterface {
    guid: string | null;
    recipients: PayoutRecipient[] | [];
    token: string | null;
}
export declare class PayoutRecipients implements PayoutRecipientsInterface {
    guid: string | null;
    recipients: PayoutRecipient[] | [];
    token: string | null;
    /**
     * Constructor, create an recipient-full request PayoutBatch object.
     *
     * @param recipients array array of JSON objects, with containing the following parameters.
     */
    constructor(recipients: PayoutRecipient[]);
}
