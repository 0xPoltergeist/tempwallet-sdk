// Permit2 signature skeleton (Uniswap).
// We intentionally do not bundle a full implementation; bring your own typed-data builder.

import type { Hex } from "./types";
import type { TempWallet } from "./wallet";

/**
 * Input parameters to build a one-time exact-amount Permit2 signature.
 * 
 * This interface defines the structure needed for Permit2 token approvals
 * without requiring a separate transaction for each approval.
 * 
 * @param token - Token contract address
 * @param amount - Amount to permit (in token's smallest unit)
 * @param spender - Address that will spend the tokens
 * @param deadline - Unix timestamp when the permit expires
 * @param chainId - Chain ID for the permit
 */
export interface Permit2Input {
  token: Hex;
  amount: bigint;
  spender: Hex;
  deadline: number; // unix seconds
  chainId: number;
}

/**
 * Result of a signed Permit2 permit.
 * 
 * Contains the signature and the typed-data payload that was signed.
 * 
 * @param signature - EIP-712 signature of the permit
 * @param payload - The typed-data payload that was signed
 */
export interface SignedPermit2 {
  signature: Hex;
  payload: Record<string, unknown>;
}

/**
 * Sign a Permit2 permit using a temporary wallet.
 * 
 * ⚠️ **NOT IMPLEMENTED**: This is a skeleton function. You need to implement
 * the actual EIP-712 signing logic or use an external library.
 * 
 * The SDK intentionally does not bundle a full Permit2 implementation to avoid
 * licensing issues and keep the bundle size small. You can:
 * 
 * 1. Use the Uniswap Permit2 SDK
 * 2. Implement your own EIP-712 signing
 * 3. Use a generic EIP-712 library
 * 
 * @param wallet - Temporary wallet to sign with
 * @param input - Permit2 parameters
 * @returns Promise resolving to signature and payload
 * @throws {Error} Always throws - not implemented
 * 
 * @example
 * ```typescript
 * // Example implementation using a generic EIP-712 library
 * import { signTypedData } from '@metamask/eth-sig-util';
 * 
 * async function signPermit2(wallet: TempWallet, input: Permit2Input): Promise<SignedPermit2> {
 *   const domain = {
 *     name: 'Permit2',
 *     chainId: input.chainId,
 *     verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3' // Permit2 contract
 *   };
 * 
 *   const types = {
 *     PermitDetails: [
 *       { name: 'token', type: 'address' },
 *       { name: 'amount', type: 'uint160' },
 *       { name: 'expiration', type: 'uint48' },
 *       { name: 'nonce', type: 'uint48' }
 *     ],
 *     PermitSingle: [
 *       { name: 'details', type: 'PermitDetails' },
 *       { name: 'spender', type: 'address' },
 *       { name: 'sigDeadline', type: 'uint256' }
 *     ]
 *   };
 * 
 *   const message = {
 *     details: {
 *       token: input.token,
 *       amount: input.amount,
 *       expiration: input.deadline,
 *       nonce: 0 // You need to get the current nonce
 *     },
 *     spender: input.spender,
 *     sigDeadline: input.deadline
 *   };
 * 
 *   const signature = await wallet.wallet.signTypedData(domain, types, message);
 *   
 *   return {
 *     signature: signature as Hex,
 *     payload: { domain, types, message }
 *   };
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Using with Uniswap Permit2 SDK (if available)
 * // import { Permit2 } from '@uniswap/permit2-sdk';
 * 
 * // const permit2 = new Permit2(chainId, provider);
 * // const permit = await permit2.permit(
 * //   wallet.address,
 * //   token,
 * //   amount,
 * //   spender,
 * //   deadline
 * // );
 * ```
 */
export async function signPermit2(_wallet: TempWallet, _input: Permit2Input): Promise<SignedPermit2> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { wallet: _wallet, input: _input };
  throw new Error(
    "Permit2 signing not implemented. Use a Permit2 library or extend this function. " +
    "See the JSDoc examples for implementation guidance."
  );
}
