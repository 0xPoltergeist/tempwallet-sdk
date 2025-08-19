import { JsonRpcProvider, Wallet } from "ethers";
import type { TransactionRequest } from "ethers";
import type { SweepBuildInput } from "./types";
import { getBalanceWei } from "./utils";
import { NoBalanceToSweepError, InsufficientAfterBufferError } from "./errors";

/**
 * Build a transaction that sweeps ALL available ETH from `fromAddress` to `to`.
 * 
 * This function calculates the maximum amount that can be swept after accounting for gas costs.
 * Perfect for cleaning up temporary wallets after they've served their purpose.
 * 
 * @param input - Sweep configuration
 * @param input.fromAddress - Source address to sweep from
 * @param input.to - Destination address to sweep to
 * @param input.providerUrl - RPC provider URL for balance checking
 * @param input.gasLimitBuffer - Optional buffer to reserve for gas costs (in wei)
 * @returns Promise resolving to a TransactionRequest ready for signing
 * @throws {NoBalanceToSweepError} If the source address has no balance
 * @throws {InsufficientAfterBufferError} If the balance is insufficient after gas buffer
 * 
 * @example
 * ```typescript
 * // Build a sweep transaction from a temporary wallet
 * const sweepTx = await buildSweepTx({
 *   fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *   gasLimitBuffer: parseEther("0.001") // Reserve 0.001 ETH for gas
 * });
 * 
 * // The transaction is ready to be signed and sent
 * console.log(`Sweeping ${formatEther(sweepTx.value!)} ETH`);
 * ```
 */
export async function buildSweepTx(input: SweepBuildInput): Promise<TransactionRequest> {
  const balance = await getBalanceWei(input.providerUrl, input.fromAddress);
  if (balance === 0n) throw new NoBalanceToSweepError();

  const gasBuffer = input.gasLimitBuffer ?? 0n;
  const value = balance > gasBuffer ? balance - gasBuffer : 0n;
  if (value <= 0n) throw new InsufficientAfterBufferError();

  return { to: input.to, value };
}

/**
 * Sign & send a prepared sweep transaction using the provided private key.
 * 
 * This is a convenience function for executing sweep transactions. You can also
 * use your own signer or wallet implementation.
 * 
 * @param providerUrl - RPC provider URL for transaction submission
 * @param privateKey - Private key of the source address (without 0x prefix)
 * @param tx - Transaction request (typically from buildSweepTx)
 * @returns Promise resolving to the transaction hash
 * @throws {Error} If the transaction fails (network, insufficient funds, etc.)
 * 
 * @example
 * ```typescript
 * // Build and send a sweep transaction
 * const sweepTx = await buildSweepTx({
 *   fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
 * });
 * 
 * const txHash = await sendSweepTx(
 *   "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *   "your-private-key-here",
 *   sweepTx
 * );
 * 
 * console.log(`Sweep transaction sent: ${txHash}`);
 * ```
 * 
 * @example
 * ```typescript
 * // Alternative: Use your own signer
 * const sweepTx = await buildSweepTx({...});
 * const provider = new JsonRpcProvider(providerUrl);
 * const signer = new Wallet(privateKey, provider);
 * const tx = await signer.sendTransaction(sweepTx);
 * ```
 */
export async function sendSweepTx(providerUrl: string, privateKey: string, tx: TransactionRequest): Promise<string> {
  const provider = new JsonRpcProvider(providerUrl);
  const signer = new Wallet(privateKey, provider);
  const resp = await signer.sendTransaction(tx);
  const receipt = await resp.wait();
  return receipt?.hash ?? resp.hash;
}
