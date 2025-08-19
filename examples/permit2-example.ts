/**
 * Permit2 example demonstrating Permit2 signature skeleton
 * 
 * This example shows:
 * - Permit2 input structure
 * - How to implement Permit2 signing (skeleton)
 * - Integration with external EIP-712 libraries
 * 
 * Note: This SDK provides a skeleton - you need to implement the actual signing
 * 
 * Run with: npx tsx examples/permit2-example.ts
 */

import { 
  createTempWallet,
  Permit2Input,
  SignedPermit2
} from "../src";
import { parseEther } from "ethers";

// Example implementation of Permit2 signing (you would implement this)
async function signPermit2Example(
  wallet: any, 
  input: Permit2Input
): Promise<SignedPermit2> {
  // This is an example implementation - you would use a real EIP-712 library
  
  const domain = {
    name: 'Permit2',
    chainId: input.chainId,
    verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3' // Permit2 contract
  };

  const types = {
    PermitDetails: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' }
    ],
    PermitSingle: [
      { name: 'details', type: 'PermitDetails' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' }
    ]
  };

  const message = {
    details: {
      token: input.token,
      amount: input.amount,
      expiration: input.deadline,
      nonce: 0 // You need to get the current nonce
    },
    spender: input.spender,
    sigDeadline: input.deadline
  };

  // In a real implementation, you would sign this with the wallet
  // const signature = await wallet.wallet.signTypedData(domain, types, message);
  
  // For this example, we'll return a mock signature
  const mockSignature = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b" as const;
  
  return {
    signature: mockSignature,
    payload: { domain, types, message }
  };
}

async function main() {
  console.log("🔐 TempWallet SDK Permit2 Example\n");

  // 1. Create a temporary wallet
  console.log("1. Creating temporary wallet...");
  const wallet = createTempWallet({ 
    ttl: 3600, 
    label: "permit2-demo" 
  });
  
  console.log(`   Address: ${wallet.address}\n`);

  // 2. Define Permit2 parameters
  console.log("2. Defining Permit2 parameters...");
  const permitInput: Permit2Input = {
    token: "0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C" as const, // example token
    amount: parseEther("100"), // 100 tokens
    spender: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" as const, // spender address
    deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    chainId: 1 // Ethereum mainnet
  };
  
  console.log("   Permit2 input:");
  console.log(`   - Token: ${permitInput.token}`);
  console.log(`   - Amount: ${permitInput.amount.toString()}`);
  console.log(`   - Spender: ${permitInput.spender}`);
  console.log(`   - Deadline: ${new Date(permitInput.deadline * 1000).toISOString()}`);
  console.log(`   - Chain ID: ${permitInput.chainId}\n`);

  // 3. Sign the permit (example implementation)
  console.log("3. Signing Permit2 permit...");
  try {
    const signedPermit = await signPermit2Example(wallet, permitInput);
    
    console.log("   Signed permit:");
    console.log(`   - Signature: ${signedPermit.signature}`);
    console.log(`   - Payload: ${JSON.stringify(signedPermit.payload, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Error signing permit: ${error.message}\n`);
  }

  // 4. Demonstrate integration with external libraries
  console.log("4. Integration with external libraries...");
  console.log(`
   // Option 1: Use @metamask/eth-sig-util
   // npm install @metamask/eth-sig-util
   
   import { signTypedData } from '@metamask/eth-sig-util';
   
   const signature = signTypedData({
     privateKey: Buffer.from(wallet.privateKey.slice(2), 'hex'),
     data: {
       types: signedPermit.payload.types,
       primaryType: 'PermitSingle',
       domain: signedPermit.payload.domain,
       message: signedPermit.payload.message
     },
     version: 'V4'
   });
   
   // Option 2: Use ethers.js built-in signing
   const signature = await wallet.wallet.signTypedData(
     signedPermit.payload.domain,
     signedPermit.payload.types,
     signedPermit.payload.message
   );
   
   // Option 3: Use Uniswap Permit2 SDK (if available)
   // import { Permit2 } from '@uniswap/permit2-sdk';
   // const permit2 = new Permit2(chainId, provider);
   // const permit = await permit2.permit(
   //   wallet.address,
   //   token,
   //   amount,
   //   spender,
   //   deadline
   // );
  `);

  // 5. Show how to use the permit
  console.log("5. Using the permit...");
  console.log(`
   // The signed permit can now be used with Permit2 contracts
   // Example contract interaction:
   
   const permit2Contract = new Contract(
     '0x000000000022D473030F116dDEE9F6B43aC78BA3',
     Permit2ABI,
     provider
   );
   
   await permit2Contract.permit(
     wallet.address,
     permitInput.token,
     permitInput.amount,
     permitInput.deadline,
     signedPermit.signature
   );
  `);

  console.log("✅ Permit2 example completed successfully!");
  console.log("\n📝 Note: This SDK provides a skeleton. Implement actual signing with your preferred EIP-712 library.");
}

main().catch(console.error);
