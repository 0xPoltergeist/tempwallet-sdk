import { describe, it, expect } from "vitest";
import { estimateTotalCostWei, estimateWithMarginWei } from "../src/estimate";
describe("estimate", () => {
    it("computes total gas cost", () => {
        const total = estimateTotalCostWei({ gasUnits: 21000n, gasPriceWei: 20000000000n });
        expect(total).toBe(420000000000000n);
    });
    it("applies a margin in bps", () => {
        const total = estimateWithMarginWei({ gasUnits: 21000n, gasPriceWei: 20000000000n }, 2000);
        expect(total).toBe(504000000000000n);
    });
});
