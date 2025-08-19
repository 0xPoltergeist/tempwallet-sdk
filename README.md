# @tempwallet/sdk — v0.1.0

> **Ephemeral Wallet SDK for Ethereum & EVM chains**  
> Create **temporary, single-use wallets** with built-in safety (TTL, one-time semantics, sweep helpers, Safe builders).  
> Designed for **one-time payments, demo sessions, disposable accounts, and secure checkout flows**.  
>
> ⚡ **No servers. No custody. No contracts. Just pure client-side helpers.**

[![npm version](https://badge.fury.io/js/%40tempwallet%2Fsdk.svg)](https://badge.fury.io/js/%40tempwallet%2Fsdk)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![CI](https://github.com/tempwallet/sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/tempwallet/sdk/actions/workflows/ci.yml)

---

## 🎯 Why TempWallet SDK?

Developers often struggle when building **short-lived wallet flows** for payments, access, or testing:

- ❌ Reusing normal wallets is insecure (private key exposure, replay risks)  
- ❌ Building sweeps & gas buffers from scratch is error-prone  
- ❌ Safe integrations require verbose boilerplate  
- ❌ Permit2 / EIP-712 signing flows are tedious to set up  

👉 **TempWallet SDK solves this by giving you:**

- 🪪 **Ephemeral wallets** — single-use semantics with TTL enforcement  
- ⛽ **Gas helpers** — estimate, add margin, and sweep correctly with safety buffers  
- 🔒 **Error-proof API** — typed errors for expired or reused wallets  
- 🛡 **Safe builders** — ready-to-use payloads for Safe Core SDK  
- 🧹 **Sweep utilities** — clean up leftover ETH after payments  
- 🪙 **Permit2 skeletons** — plug-and-play flows for token approvals  

**Built on ethers v6.** Type-safe. Tree-shakeable. Zero infra required.

---

## 📦 Installation

```bash
npm install @tempwallet/sdk ethers
```

> Requires: `ethers` v6.13.0+ (peer dependency)

---

## 🚀 Quick Start

### One-Time ETH Checkout

```ts
import { createTempWallet, buildSweepTx } from "@tempwallet/sdk";
import { parseEther } from "ethers";

// 1. Create a temporary wallet
const wallet = createTempWallet({ ttl: 3600, label: "checkout-session-123" });
console.log("Ephemeral address:", wallet.address);

// 2. Send ETH payment
const txHash = await wallet.sendTransaction({
  providerUrl: process.env.RPC_URL!,
  to: "0xRecipient",
  value: parseEther("0.1"),
});
console.log("Payment sent:", txHash);

// 3. Sweep leftover funds (optional)
const sweepTx = await buildSweepTx({
  fromAddress: wallet.address,
  to: "0xMainWallet",
  providerUrl: process.env.RPC_URL!,
  gasLimitBuffer: parseEther("0.001"),
});
```

---

## 📚 API Overview

### `createTempWallet(opts?)`
Creates an ephemeral wallet with TTL & one-time semantics.

```ts
const wallet = createTempWallet({ ttl: 1800, label: "demo" });
```

### `wallet.sendTransaction(input)`
Sends a transaction with single-use enforcement.

Throws:
- `ExpiredSessionError` if TTL passed  
- `AlreadyUsedError` if reused  

### `buildSweepTx(input)`
Builds a sweep transaction to move all ETH safely with gas buffer.

### `estimateTotalCostWei(input)` / `estimateWithMarginWei(input, marginBps)`
Gas cost calculators with optional safety margin.

### `buildSafePayment(params)` / `buildSafeSweep(params)`
Ready-to-use payloads for Safe Core SDK.

### `buildPaymentURI(address, wei?)`
Generates **EIP-681 payment URIs** (`ethereum:0x...`).

---

## 🔥 Real Use Cases

1. **Crypto Checkout**  
   Accept ETH payments with ephemeral wallets that auto-expire & sweep.

2. **Demo / Sandbox Accounts**  
   Let users play in your dApp without touching their main wallet.

3. **Disposable Session Keys**  
   Issue one-time wallets for gated content or temporary access.

4. **Safe Transactions**  
   Build Safe-compatible payment payloads in 1 line.

5. **Permit2 Token Flows**  
   Generate typed skeletons for Permit2 signatures.

---

## ⚠️ Typed Errors

```ts
import { ExpiredSessionError, AlreadyUsedError } from "@tempwallet/sdk";

try {
  await wallet.sendTransaction(tx);
} catch (err) {
  if (err instanceof ExpiredSessionError) {
    console.log("Wallet expired — create new one");
  }
}
```

| Error | Trigger |
|-------|---------|
| `ExpiredSessionError` | TTL exceeded |
| `AlreadyUsedError` | Wallet reused |
| `NoBalanceToSweepError` | No ETH to sweep |
| `InsufficientAfterBufferError` | Not enough balance after gas buffer |

---

## 🔒 Security Best Practices

✅ Generate keys only client-side  
✅ Use secure storage (memory/session only for TTL)  
✅ Always sweep leftovers  
✅ Enforce TTL (default 1h)  
❌ Never reuse ephemeral wallets  
❌ Don’t use in production without sweep fallback  

---

## 🗺 Roadmap

- [🚧] ERC-20 & ERC-721 sweep helpers  
- [ ] Batch transaction builder  
- [ ] Auto RPC gas estimator  
- [ ] Multi-chain presets (Optimism, Base, Polygon, Arbitrum)  
- [ ] Recovery flows (optional seed phrase support)  

---

## 🤝 Contributing

Contributions welcome!  
Check [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

## 💸 Support

If this SDK saved you time or you like the philosophy of **zero infra helpers**, feel free to send a tip ❤️:

**ETH / USDC:** `0x687848FC782Dc20edCa4b535f27fB4b1B398a305`

---

## 🔗 Links

- [Docs](https://github.com/tempwallet/sdk)  
- [Issues](https://github.com/tempwallet/sdk/issues)  
- [Security](SECURITY.md)  
- [Changelog](CHANGELOG.md)  
- [Contact](https://x.com/0xPoltergeist)

---

*Ephemeral wallet SDK, temporary Ethereum wallet, one-time crypto payments, secure ETH checkout, Safe transaction builder, Permit2 helper, sweep ETH balance, gas estimation utils, client-side EVM flows.*
