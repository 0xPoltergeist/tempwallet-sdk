import { describe, it, expect } from "vitest";
import { estimateTotalCostWei, estimateWithMarginWei } from "../src/estimate";

describe("estimate", () => {
  it("computes total gas cost", () => {
    const total = estimateTotalCostWei({ gasUnits: 21000n, gasPriceWei: 20_000_000_000n });
    expect(total).toBe(420_000_000_000_000n);
  });
  it("applies a margin in bps", () => {
    const total = estimateWithMarginWei({ gasUnits: 21000n, gasPriceWei: 20_000_000_000n }, 2000);
    expect(total).toBe(504_000_000_000_000n);
  });
});
