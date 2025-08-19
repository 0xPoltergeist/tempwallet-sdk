import { describe, it, expect, vi } from "vitest";
import * as utils from "../src/utils";
import { buildSweepTx } from "../src/sweep";
describe("buildSweepTx", () => {
    it("throws when no balance", async () => {
        vi.spyOn(utils, "getBalanceWei").mockResolvedValueOnce(0n);
        await expect(buildSweepTx({
            fromAddress: "0x0000000000000000000000000000000000000000",
            to: "0x000000000000000000000000000000000000dEaD",
            providerUrl: "http://localhost:8545"
        })).rejects.toThrow();
    });
    it("builds when there is balance", async () => {
        vi.spyOn(utils, "getBalanceWei").mockResolvedValueOnce(10000000000000000n);
        const tx = await buildSweepTx({
            fromAddress: "0x0000000000000000000000000000000000000001",
            to: "0x000000000000000000000000000000000000dEaD",
            providerUrl: "http://localhost:8545",
            gasLimitBuffer: 1000n
        });
        expect(tx.to).toBe("0x000000000000000000000000000000000000dEaD");
        expect(typeof tx.value).toBe("bigint");
    });
});
