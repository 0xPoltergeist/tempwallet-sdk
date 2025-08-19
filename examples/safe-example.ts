/**
 * Safe (Gnosis Safe) example demonstrating Safe builder usage
 * 
 * This example shows:
 * - Building Safe payment payloads
 * - Building Safe sweep payloads
 * - Integration with Safe Core SDK (pseudo-code)
 * 
 * Note: This SDK only builds payloads, you need Safe Core SDK to execute
 * 
 * Run with: npx tsx examples/safe-example.ts
 */

import { 
  buildSafePayment, 
  buildSafeSweep,
  formatEther
} from "../src";
import { parseEther } from "ethers";

async function main() {
  console.log("🏦 TempWallet SDK Safe Example\n");

  // Example Safe address (replace with your actual Safe address)
  const safeAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
  const recipient = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
  const providerUrl = "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY";

  // 1. Build a simple ETH payment payload
  console.log("1. Building Safe payment payload...");
  const paymentPayload = buildSafePayment({
    to: recipient,
    value: parseEther("0.1"),
    data: "0x" // optional contract interaction data
  });
  
  console.log("   Payment payload:");
  console.log(`   - To: ${paymentPayload.to}`);
  console.log(`   - Value: ${formatEther(paymentPayload.value)} ETH`);
  console.log(`   - Data: ${paymentPayload.data}\n`);

  // 2. Build a contract interaction payload
  console.log("2. Building Safe contract interaction payload...");
  const contractPayload = buildSafePayment({
    to: "0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C", // example contract
    value: 0n,
    data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d4c9db96c4b4d8b60000000000000000000000000000000000000000000000000000000000000064" // transfer(address,uint256)
  });
  
  console.log("   Contract interaction payload:");
  console.log(`   - To: ${contractPayload.to}`);
  console.log(`   - Value: ${formatEther(contractPayload.value)} ETH`);
  console.log(`   - Data: ${contractPayload.data}\n`);

  // 3. Build a sweep payload
  console.log("3. Building Safe sweep payload...");
  try {
    const sweepPayload = await buildSafeSweep({
      providerUrl,
      safeAddress,
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" // destination
    });
    
    console.log("   Sweep payload:");
    console.log(`   - To: ${sweepPayload.to}`);
    console.log(`   - Value: ${formatEther(sweepPayload.value)} ETH`);
    console.log(`   - Data: ${sweepPayload.data}\n`);
  } catch (error) {
    console.log(`   ❌ Error building sweep payload: ${error.message}\n`);
  }

  // 4. Demonstrate Safe Core SDK integration (pseudo-code)
  console.log("4. Safe Core SDK Integration (pseudo-code)...");
  console.log(`
   // Install Safe Core SDK:
   // npm install @safe-global/safe-core-sdk
   
   // Example integration:
   import Safe from '@safe-global/safe-core-sdk';
   
   // Create Safe SDK instance
   const safeSdk = await Safe.create({
     ethAdapter: ethAdapter,
     safeAddress: '${safeAddress}'
   });
   
   // Execute payment transaction
   const tx = await safeSdk.createTransaction(${JSON.stringify(paymentPayload, null, 2)});
   const txResponse = await safeSdk.executeTransaction(tx);
   
   console.log('Safe transaction executed:', txResponse.hash);
  `);

  console.log("✅ Safe example completed successfully!");
  console.log("\n📝 Note: This SDK only builds payloads. You need Safe Core SDK to execute transactions.");
}

main().catch(console.error);
