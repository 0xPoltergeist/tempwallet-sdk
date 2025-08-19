import { Wallet, JsonRpcProvider } from "ethers";
import type { TransactionRequest } from "ethers";
import type { CreateTempWalletOpts, TempWalletMeta, ExecuteTxInput, Hex } from "./types";
import { ExpiredSessionError, AlreadyUsedError } from "./errors";

/**
 * TempWallet: an in-memory EOA intended for single-use flows.
 * 
 * A temporary wallet that generates keys client-side and provides single-use semantics.
 * Perfect for one-time payments, temporary access, or disposable accounts.
 * 
 * Key features:
 * - Keys are generated client-side and live with your app
 * - `used` + `expiresAt` are client-side semantics; nothing is enforced on-chain
 * - Automatic expiration and usage tracking
 * - Type-safe transaction execution
 * 
 * @example
 * ```typescript
 * // Create a wallet that expires in 1 hour
 * const wallet = createTempWallet({ ttl: 3600, label: "checkout" });
 * 
 * // Send a transaction
 * const txHash = await wallet.sendTransaction({
 *   providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
 *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   value: parseEther("0.1")
 * });
 * 
 * // Check if wallet is still valid
 * if (wallet.isExpired() || wallet.meta.used) {
 *   console.log("Wallet can no longer be used");
 * }
 * ```
 */
export class TempWallet {
  readonly wallet: Wallet;
  readonly meta: TempWalletMeta;

  constructor(w: Wallet, meta: TempWalletMeta) {
    this.wallet = w;
    this.meta = meta;
  }

  /**
   * The wallet's Ethereum address
   */
  get address(): Hex { return this.wallet.address as Hex; }

  /**
   * Check if the wallet has expired based on its TTL
   * @returns true if the wallet has expired, false otherwise
   */
  isExpired(): boolean { return !!this.meta.expiresAt && Date.now() > (this.meta.expiresAt ?? 0); }

  /**
   * Mark the wallet as used. This prevents further transactions.
   * Called automatically after successful transaction execution.
   */
  markAsUsed(): void { this.meta.used = true; }

  /**
   * Send a transaction using this temporary wallet.
   * 
   * @param input - Transaction parameters and provider URL
   * @returns Promise resolving to the transaction hash
   * @throws {AlreadyUsedError} If the wallet has already been used
   * @throws {ExpiredSessionError} If the wallet has expired
   * @throws {Error} If the transaction fails (network, insufficient funds, etc.)
   * 
   * @example
   * ```typescript
   * const txHash = await wallet.sendTransaction({
   *   providerUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
   *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
   *   value: parseEther("0.1"),
   *   gasLimit: 21000n,
   *   maxFeePerGas: parseUnits("20", "gwei"),
   *   maxPriorityFeePerGas: parseUnits("2", "gwei")
   * });
   * ```
   */
  async sendTransaction(input: ExecuteTxInput & { providerUrl: string }): Promise<string> {
    if (this.meta.used) throw new AlreadyUsedError();
    if (this.isExpired()) throw new ExpiredSessionError();

    const provider = new JsonRpcProvider(input.providerUrl);
    const signer = this.wallet.connect(provider);

    const tx: TransactionRequest = {
      to: input.to,
      value: input.value ?? 0n,
      data: input.data ?? "0x",
      gasLimit: input.gasLimit,
      maxFeePerGas: input.maxFeePerGas,
      maxPriorityFeePerGas: input.maxPriorityFeePerGas,
      nonce: input.nonce
    };

    const resp = await signer.sendTransaction(tx);
    const receipt = await resp.wait();
    this.markAsUsed();
    return receipt?.hash ?? resp.hash;
  }
}

/**
 * Create a new temporary wallet for single-use flows.
 * 
 * @param opts - Configuration options for the wallet
 * @param opts.ttl - Time to live in seconds. Wallet will be considered expired after this time
 * @param opts.label - Optional label for UI/logging purposes
 * @returns A new TempWallet instance
 * 
 * @example
 * ```typescript
 * // Create a wallet that expires in 30 minutes
 * const wallet = createTempWallet({ 
 *   ttl: 1800, 
 *   label: "checkout-session" 
 * });
 * 
 * // Create a wallet without expiration
 * const wallet = createTempWallet({ 
 *   label: "one-time-payment" 
 * });
 * ```
 */
export function createTempWallet(opts: CreateTempWalletOpts = {}): TempWallet {
  const w = Wallet.createRandom() as unknown as Wallet;
  const now = Date.now();
  const meta: TempWalletMeta = {
    createdAt: now,
    expiresAt: opts.ttl ? now + opts.ttl * 1000 : undefined,
    label: opts.label,
    used: false
  };
  return new TempWallet(w, meta);
}
