// Builders for Safe (Gnosis Safe). You execute with Safe Core SDK in your app.
import type { Hex } from "./types";
import { getBalanceWei } from "./utils";

/**
 * Build a simple ETH payment payload for a Safe transaction.
 * 
 * This function creates a transaction payload that can be used with the Safe Core SDK.
 * The SDK does NOT execute Safe transactions - it only builds the payloads.
 * 
 * @param params - Payment parameters
 * @param params.to - Recipient address
 * @param params.value - Amount to send in wei
 * @param params.data - Optional transaction data (defaults to "0x")
 * @returns Transaction payload ready for Safe Core SDK
 * 
 * @example
 * ```typescript
 * // Build a payment payload for Safe
 * const paymentPayload = buildSafePayment({
 *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   value: parseEther("0.1"),
 *   data: "0x" // Optional contract interaction data
 * });
 * 
 * // Use with Safe Core SDK (pseudo-code)
 * // const safeSdk = await Safe.create({...});
 * // const tx = await safeSdk.createTransaction(paymentPayload);
 * // const txResponse = await safeSdk.executeTransaction(tx);
 * ```
 * 
 * @example
 * ```typescript
 * // Build a contract interaction payload
 * const contractPayload = buildSafePayment({
 *   to: "0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C",
 *   value: 0n,
 *   data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d4c9db96c4b4d8b60000000000000000000000000000000000000000000000000000000000000064" // transfer(address,uint256)
 * });
 * ```
 */
export function buildSafePayment(params: { to: Hex; value: bigint; data?: Hex }) {
  return { to: params.to, value: params.value, data: params.data ?? "0x" };
}

/**
 * Compute a sweep transaction payload for a Safe (moves full ETH balance).
 * 
 * This function calculates the maximum amount that can be swept from a Safe
 * and creates a transaction payload for the Safe Core SDK.
 * 
 * @param params - Sweep parameters
 * @param params.providerUrl - RPC provider URL for balance checking
 * @param params.safeAddress - Safe address to sweep from
 * @param params.to - Destination address to sweep to
 * @returns Transaction payload ready for Safe Core SDK
 * 
 * @example
 * ```typescript
 * // Build a sweep payload for Safe
 * const sweepPayload = await buildSafeSweep({
 *   providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *   safeAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
 * });
 * 
 * console.log(`Sweeping ${formatEther(sweepPayload.value)} ETH from Safe`);
 * 
 * // Use with Safe Core SDK (pseudo-code)
 * // const safeSdk = await Safe.create({...});
 * // const tx = await safeSdk.createTransaction(sweepPayload);
 * // const txResponse = await safeSdk.executeTransaction(tx);
 * ```
 * 
 * @example
 * ```typescript
 * // Post-use cleanup pattern
 * // 1. Create temporary Safe for a specific purpose
 * // 2. Use Safe for intended operations
 * // 3. Sweep remaining funds back to main wallet
 * const cleanupPayload = await buildSafeSweep({
 *   providerUrl: providerUrl,
 *   safeAddress: tempSafeAddress,
 *   to: mainWalletAddress
 * });
 * ```
 */
export async function buildSafeSweep(params: { providerUrl: string; safeAddress: Hex; to: Hex }) {
  const bal = await getBalanceWei(params.providerUrl, params.safeAddress);
  return { to: params.to, value: bal, data: "0x" as Hex };
}
