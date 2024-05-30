export interface InvoiceEventTokenInterface {
    url: string | null;
    token: string | null;
    events: string[] | [];
    actions: string[] | [];
}
export declare class InvoiceEventToken implements InvoiceEventTokenInterface {
    url: string | null;
    actions: string[] | [];
    events: string[] | [];
    token: string | null;
}
