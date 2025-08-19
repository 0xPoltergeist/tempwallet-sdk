/**
 * Error thrown when a temporary wallet has expired.
 * 
 * This error occurs when trying to use a wallet that has passed its TTL (time to live).
 * The expiration is client-side only and not enforced on-chain.
 * 
 * @example
 * ```typescript
 * try {
 *   await wallet.sendTransaction(tx);
 * } catch (error) {
 *   if (error instanceof ExpiredSessionError) {
 *     console.log("Wallet has expired, create a new one");
 *     const newWallet = createTempWallet({ ttl: 3600 });
 *   }
 * }
 * ```
 */
export class ExpiredSessionError extends Error {
  constructor() { 
    super("tempwallet: session expired"); 
    this.name = "ExpiredSessionError"; 
  }
}

/**
 * Error thrown when a temporary wallet has already been used.
 * 
 * Temporary wallets are designed for single-use. Once a transaction is sent,
 * the wallet is marked as used and cannot be used again.
 * 
 * @example
 * ```typescript
 * try {
 *   await wallet.sendTransaction(tx1);
 *   await wallet.sendTransaction(tx2); // This will throw AlreadyUsedError
 * } catch (error) {
 *   if (error instanceof AlreadyUsedError) {
 *     console.log("Wallet already used, create a new one");
 *     const newWallet = createTempWallet();
 *   }
 * }
 * ```
 */
export class AlreadyUsedError extends Error {
  constructor() { 
    super("tempwallet: already used"); 
    this.name = "AlreadyUsedError"; 
  }
}

/**
 * Error thrown when trying to sweep an address with no balance.
 * 
 * This error occurs when buildSweepTx() is called on an address that has zero ETH balance.
 * 
 * @example
 * ```typescript
 * try {
 *   const sweepTx = await buildSweepTx({
 *     fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *     to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *     providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
 *   });
 * } catch (error) {
 *   if (error instanceof NoBalanceToSweepError) {
 *     console.log("Address has no ETH to sweep");
 *   }
 * }
 * ```
 */
export class NoBalanceToSweepError extends Error {
  constructor() { 
    super("tempwallet: no balance to sweep"); 
    this.name = "NoBalanceToSweepError"; 
  }
}

/**
 * Error thrown when the balance is insufficient after accounting for gas buffer.
 * 
 * This error occurs when the available balance is less than or equal to the gas buffer
 * specified in buildSweepTx(), leaving nothing to sweep.
 * 
 * @example
 * ```typescript
 * try {
 *   const sweepTx = await buildSweepTx({
 *     fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *     to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *     providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *     gasLimitBuffer: parseEther("0.01") // Reserve 0.01 ETH for gas
 *   });
 * } catch (error) {
 *   if (error instanceof InsufficientAfterBufferError) {
 *     console.log("Balance too low after gas buffer");
 *     // Try with a smaller buffer or skip sweeping
 *   }
 * }
 * ```
 */
export class InsufficientAfterBufferError extends Error {
  constructor() { 
    super("tempwallet: not enough balance after gas buffer"); 
    this.name = "InsufficientAfterBufferError"; 
  }
}
