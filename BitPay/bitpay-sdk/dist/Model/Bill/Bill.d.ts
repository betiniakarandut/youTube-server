import { Item } from './Item';
export interface BillInterface {
    currency: string | null;
    token: string | null;
    email: string | null;
    items: Item[] | [];
    number: string | null;
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    dueDate: string | null;
    passProcessingFee: boolean | null;
    status: string | null;
    url: string | null;
    createdDate: string | null;
    id: string | null;
    merchant: string | null;
    cc: string[] | [];
}
export declare class Bill implements BillInterface {
    address1: string | null;
    address2: string | null;
    cc: string[] | [];
    city: string | null;
    country: string | null;
    createdDate: string | null;
    currency: string | null;
    dueDate: string | null;
    email: string | null;
    id: string | null;
    items: Item[] | [];
    merchant: string | null;
    name: string | null;
    number: string | null;
    passProcessingFee: boolean | null;
    phone: string | null;
    state: string | null;
    status: string | null;
    token: string | null;
    url: string | null;
    zip: string | null;
    /**
     * Constructor, create a minimal request Bill object.
     *
     * @param number   A string for tracking purposes.
     * @param currency The three digit currency type used to compute the bill's amount.
     * @param email    The email address of the receiver for this bill.
     * @param items    The list of itens to add to this bill.
     */
    constructor(number: string, currency: string, email: string, items: Item[]);
    setCurrency(_currency: string): void;
}
export default Item;
