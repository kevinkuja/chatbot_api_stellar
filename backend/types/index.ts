export interface TransactionResult {
  action: 'transfer' | 'invest' | 'swap';
  amount: number;
  token: string;
  to: string;
  chain: string;
  description?: string;
  message?: string;
  memo?: string;
  dest_token?: string;
  price?: number;
  dest_min?: number;
}

export type StellarTransaction = string;
