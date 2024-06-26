import { InvoiceData } from './InvoiceData';
export interface SettlementLedgerEntryInterface {
    code: number | null;
    invoiceId: string | null;
    amount: number | null;
    timestamp: number | null;
    description: string | null;
    invoiceData: InvoiceData | null;
}
export declare class SettlementLedgerEntry implements SettlementLedgerEntryInterface {
    code: number | null;
    invoiceId: string | null;
    amount: number | null;
    timestamp: number | null;
    description: string | null;
    invoiceData: InvoiceData | null;
    constructor();
}
