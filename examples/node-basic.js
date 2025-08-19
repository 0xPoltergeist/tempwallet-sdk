import { createTempWallet, buildSweepTx } from "../src";
async function main() {
    const temp = createTempWallet({ ttl: 3600, label: "demo" });
    console.log("Temp address:", temp.address);
    const tx = await buildSweepTx({
        fromAddress: temp.address,
        to: "0x000000000000000000000000000000000000dEaD",
        providerUrl: "http://localhost:8545",
        gasLimitBuffer: 1000n
    });
    console.log("Sweep tx:", tx);
}
main().catch(console.error);
