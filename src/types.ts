// Shared types for a tiny, explicit SDK.
export type Hex = `0x${string}`;

export interface CreateTempWalletOpts {
  ttl?: number;   // seconds (client-side hint)
  label?: string; // UI/logging
}

export interface TempWalletMeta {
  createdAt: number;
  expiresAt?: number;
  label?: string;
  used: boolean;
}

export interface ExecuteTxInput {
  to: Hex;
  value?: bigint; // wei
  data?: Hex;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
  chainId?: number;
}

export interface SweepBuildInput {
  fromAddress: Hex;
  to: Hex;
  providerUrl: string;
  gasLimitBuffer?: bigint;
}

export interface EstimateInputWei {
  gasUnits: bigint;
  gasPriceWei: bigint;
}
