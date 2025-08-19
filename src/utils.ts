import { JsonRpcProvider, formatEther, parseEther } from "ethers";
import type { Hex } from "./types";

/**
 * Read ETH balance (wei) via a JSON-RPC endpoint.
 * 
 * @param providerUrl - RPC provider URL (e.g., Alchemy, Infura, local node)
 * @param address - Ethereum address to check balance for
 * @returns Promise resolving to balance in wei
 * @throws {Error} If the RPC call fails (network, invalid address, etc.)
 * 
 * @example
 * ```typescript
 * // Check balance of an address
 * const balance = await getBalanceWei(
 *   "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *   "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
 * );
 * 
 * console.log(`Balance: ${formatEther(balance)} ETH`);
 * ```
 * 
 * @example
 * ```typescript
 * // Check balance before sweeping
 * const balance = await getBalanceWei(providerUrl, walletAddress);
 * if (balance > 0n) {
 *   console.log(`Wallet has ${formatEther(balance)} ETH to sweep`);
 * } else {
 *   console.log("Wallet is empty");
 * }
 * ```
 */
export async function getBalanceWei(providerUrl: string, address: Hex): Promise<bigint> {
  const provider = new JsonRpcProvider(providerUrl);
  return await provider.getBalance(address);
}

/**
 * Build a simple payment URI (EIP-681 compatible).
 * 
 * Creates a URI that can be used to initiate payments in wallet apps.
 * Basic EIP-681 support - for complex cases, consider using a dedicated library.
 * 
 * @param address - Recipient Ethereum address
 * @param wei - Optional amount in wei to pre-fill
 * @returns EIP-681 compatible payment URI
 * 
 * @example
 * ```typescript
 * // Build a payment URI without amount
 * const uri = buildPaymentURI("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");
 * console.log(uri);
 * // Output: ethereum:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
 * ```
 * 
 * @example
 * ```typescript
 * // Build a payment URI with pre-filled amount
 * const uri = buildPaymentURI(
 *   "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   parseEther("0.1")
 * );
 * console.log(uri);
 * // Output: ethereum:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6?value=100000000000000000
 * ```
 * 
 * @example
 * ```typescript
 * // Use in QR code for mobile payments
 * const paymentUri = buildPaymentURI(recipientAddress, amount);
 * // Generate QR code with paymentUri
 * // User scans QR code with wallet app
 * ```
 */
export function buildPaymentURI(address: Hex, wei?: bigint): string {
  return wei ? `ethereum:${address}?value=${wei.toString()}` : `ethereum:${address}`;
}

/**
 * Re-export ethers utilities for convenience.
 * 
 * These are commonly used functions for working with ETH amounts:
 * - `formatEther`: Convert wei to ETH (string)
 * - `parseEther`: Convert ETH to wei (bigint)
 */
export { formatEther, parseEther };
