// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {WealthProofRegistry} from "../contracts/WealthProofRegistry.sol";
import {WealthProofInstance} from "../contracts/WealthProofInstance.sol";

/**
 * @title Demo
 * @notice Complete ZK Flex demonstration script
 * @dev Run: forge script script/Demo.s.sol --fork-url http://localhost:8545 --broadcast -vv
 */
contract Demo is Script {
    
    function run() public {
        console.log("=== ZK Flex Demo ===");
        console.log("");
        
        vm.startBroadcast();
        
        // Step 1: Deploy Registry
        console.log("Step 1: Deploying Registry...");
        WealthProofRegistry registry = new WealthProofRegistry();
        console.log("  Registry:", address(registry));
        console.log("  Verifier:", address(registry.verifier()));
        console.log("");
        
        // Step 2: Create wallet pool (32 addresses)
        console.log("Step 2: Creating wallet pool instance...");
        address[32] memory walletPool = generateWalletPool();
        
        address bobReal = walletPool[15]; // Bob hidden at position 15
        console.log("  Bob_real:", bobReal);
        console.log("  Bob_index: 15 (PRIVATE)");
        console.log("  Pool size: 32 addresses");
        console.log("");
        
        address instance = registry.createProofInstance(walletPool);
        console.log("  Instance created:", instance);
        console.log("");
        
        // Step 3: View snapshot
        console.log("Step 3: Balance snapshot created");
        WealthProofInstance inst = WealthProofInstance(instance);
        WealthProofInstance.Snapshot memory snap = inst.getLatestSnapshot();
        console.log("  Block:", snap.blockNumber);
        console.log("  Addresses: 32");
        console.log("  Anonymity set: 1/32 = 3.125%");
        console.log("");
        
        vm.stopBroadcast();
        
        // Step 4: Explain proof generation (off-chain)
        console.log("Step 4: Proof generation (browser)");
        console.log("  1. Bob signs with MetaMask");
        console.log("  2. Browser generates ZK proof");
        console.log("  3. ~1.88M constraints");
        console.log("  4. Time: 30-60 seconds");
        console.log("  5. Output: proof.json (288 bytes)");
        console.log("");
        
        // Step 5: Explain verification
        console.log("Step 5: Proof verification");
        console.log("  - Alice calls verifyProof() (VIEW)");
        console.log("  - FREE (no gas)");
        console.log("  - Result: Valid/Invalid");
        console.log("");
        
        // Summary
        console.log("=== Demo Complete ===");
        console.log("");
        console.log("Key Points:");
        console.log("  - Bob_proxy creates instance (visible)");
        console.log("  - Bob_real hidden in 32 addresses");
        console.log("  - ZK proof: 30-60s generation");
        console.log("  - Verification: FREE (view function)");
        console.log("  - Privacy: Bob identity protected");
        console.log("");
        console.log("Instance Address:", instance);
        console.log("Use this in frontend!");
        console.log("");
    }
    
    function generateWalletPool() internal view returns (address[32] memory) {
        address[32] memory pool;
        
        // Use anvil default accounts
        pool[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        pool[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        pool[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        pool[3] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        pool[4] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        pool[5] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        pool[6] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        pool[7] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        pool[8] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        pool[9] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        
        // Fill remaining with generated addresses
        for (uint256 i = 10; i < 32; i++) {
            if (i != 15) {
                pool[i] = address(uint160(uint256(keccak256(abi.encodePacked("addr", i)))));
            }
        }
        
        // Bob_real at position 15
        pool[15] = pool[5]; // Use Account #5 as Bob_real
        
        return pool;
    }
}

