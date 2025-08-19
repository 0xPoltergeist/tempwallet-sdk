/**
 * Basic example demonstrating TempWallet SDK usage
 * 
 * This example shows:
 * - Creating a temporary wallet
 * - Building a sweep transaction
 * - Error handling
 * 
 * Run with: npx tsx examples/node-basic.ts
 */

import { 
  createTempWallet, 
  buildSweepTx, 
  estimateTotalCostWei,
  formatEther,
  ExpiredSessionError,
  AlreadyUsedError,
  NoBalanceToSweepError
} from "../src";
import { parseEther, parseUnits } from "ethers";

async function main() {
  console.log("🚀 TempWallet SDK Basic Example\n");

  // 1. Create a temporary wallet
  console.log("1. Creating temporary wallet...");
  const tempWallet = createTempWallet({ 
    ttl: 3600, // expires in 1 hour
    label: "demo-wallet" 
  });
  
  console.log(`   Address: ${tempWallet.address}`);
  console.log(`   Expires: ${new Date(tempWallet.meta.expiresAt!).toISOString()}`);
  console.log(`   Used: ${tempWallet.meta.used}\n`);

  // 2. Check if wallet is valid
  console.log("2. Checking wallet status...");
  if (tempWallet.isExpired()) {
    console.log("   ❌ Wallet has expired");
    return;
  }
  console.log("   ✅ Wallet is valid\n");

  // 3. Estimate gas costs
  console.log("3. Estimating gas costs...");
  const gasCost = estimateTotalCostWei({
    gasUnits: 21000n, // ETH transfer
    gasPriceWei: parseUnits("20", "gwei")
  });
  console.log(`   ETH transfer cost: ${formatEther(gasCost)} ETH\n`);

  // 4. Build sweep transaction (this will fail since wallet has no balance)
  console.log("4. Building sweep transaction...");
  try {
    const sweepTx = await buildSweepTx({
      fromAddress: tempWallet.address,
      to: "0x000000000000000000000000000000000000dEaD", // dead address
      providerUrl: "http://localhost:8545", // local node
      gasLimitBuffer: parseEther("0.001") // reserve 0.001 ETH for gas
    });
    console.log(`   Sweep amount: ${formatEther(sweepTx.value!)} ETH`);
  } catch (error) {
    if (error instanceof NoBalanceToSweepError) {
      console.log("   ❌ No balance to sweep (expected for new wallet)");
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // 5. Demonstrate error handling
  console.log("\n5. Demonstrating error handling...");
  
  // Try to use wallet twice (will fail)
  try {
    // Simulate first use
    tempWallet.markAsUsed();
    
    // Try to use again
    await tempWallet.sendTransaction({
      providerUrl: "http://localhost:8545",
      to: "0x000000000000000000000000000000000000dEaD",
      value: 0n
    });
  } catch (error) {
    if (error instanceof AlreadyUsedError) {
      console.log("   ❌ Wallet already used (expected)");
    } else {
      console.log(`   ❌ Unexpected error: ${error.message}`);
    }
  }

  console.log("\n✅ Example completed successfully!");
}

main().catch(console.error);
