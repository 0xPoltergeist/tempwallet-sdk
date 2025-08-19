import { describe, it, expect } from "vitest";
import { createTempWallet } from "../src/wallet";
describe("TempWallet", () => {
    it("creates an EOA and exposes address", () => {
        const w = createTempWallet();
        expect(w.address.startsWith("0x")).toBe(true);
        expect(w.meta.used).toBe(false);
    });
    it("respects TTL (client-side)", async () => {
        const w = createTempWallet({ ttl: 1 });
        expect(w.isExpired()).toBe(false);
        await new Promise((r) => setTimeout(r, 1100));
        expect(w.isExpired()).toBe(true);
    });
});
