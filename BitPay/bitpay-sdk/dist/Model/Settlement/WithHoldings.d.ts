export interface WithHoldingsInterface {
    amount: number;
    code: string | null;
    description: string | null;
    notes: string | null;
    label: string | null;
    bankCountry: string | null;
}
export declare class WithHoldings implements WithHoldingsInterface {
    amount: number;
    code: string | null;
    description: string | null;
    notes: string | null;
    label: string | null;
    bankCountry: string | null;
    constructor();
}
