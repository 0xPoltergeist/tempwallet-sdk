import type { EstimateInputWei } from "./types";

/**
 * Calculate the total gas cost in wei.
 * 
 * Basic formula: totalWei = gasUnits * gasPriceWei
 * 
 * @param input - Gas estimation parameters
 * @param input.gasUnits - Number of gas units required
 * @param input.gasPriceWei - Gas price in wei per unit
 * @returns Total cost in wei
 * 
 * @example
 * ```typescript
 * // Estimate cost for a simple ETH transfer (21,000 gas units)
 * const cost = estimateTotalCostWei({
 *   gasUnits: 21000n,
 *   gasPriceWei: parseUnits("20", "gwei") // 20 gwei
 * });
 * 
 * console.log(`Total cost: ${formatEther(cost)} ETH`);
 * // Output: Total cost: 0.00042 ETH
 * ```
 * 
 * @example
 * ```typescript
 * // Estimate cost for a complex contract interaction
 * const cost = estimateTotalCostWei({
 *   gasUnits: 150000n,
 *   gasPriceWei: parseUnits("25", "gwei") // 25 gwei
 * });
 * 
 * console.log(`Total cost: ${formatEther(cost)} ETH`);
 * // Output: Total cost: 0.00375 ETH
 * ```
 */
export function estimateTotalCostWei(input: EstimateInputWei): bigint {
  return input.gasUnits * input.gasPriceWei;
}

/**
 * Calculate the total gas cost with a safety margin.
 * 
 * Formula: totalWithMargin = totalWei * (1 + marginBps/10_000)
 * 
 * @param input - Gas estimation parameters
 * @param input.gasUnits - Number of gas units required
 * @param input.gasPriceWei - Gas price in wei per unit
 * @param marginBps - Safety margin in basis points (1 bps = 0.01%)
 * @returns Total cost with margin in wei
 * 
 * @example
 * ```typescript
 * // Estimate cost with 10% safety margin (1000 bps)
 * const costWithMargin = estimateWithMarginWei({
 *   gasUnits: 21000n,
 *   gasPriceWei: parseUnits("20", "gwei")
 * }, 1000);
 * 
 * console.log(`Cost with 10% margin: ${formatEther(costWithMargin)} ETH`);
 * // Output: Cost with 10% margin: 0.000462 ETH
 * ```
 * 
 * @example
 * ```typescript
 * // Common margin values
 * const MARGIN_5_PERCENT = 500;   // 5%
 * const MARGIN_10_PERCENT = 1000; // 10%
 * const MARGIN_20_PERCENT = 2000; // 20%
 * 
 * const cost = estimateWithMarginWei({
 *   gasUnits: 100000n,
 *   gasPriceWei: parseUnits("30", "gwei")
 * }, MARGIN_10_PERCENT);
 * ```
 */
export function estimateWithMarginWei(input: EstimateInputWei, marginBps: number): bigint {
  const total = estimateTotalCostWei(input);
  return total * BigInt(10_000 + marginBps) / 10_000n;
}
