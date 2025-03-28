export interface TransactionResult {
  action: 'transfer' | 'invest' | 'swap';
  amount: number;
  token: string;
  to: string;
  chain: string;
  description?: string;
  message?: string;
  memo?: string;
}

export type StellarTransaction = string;
