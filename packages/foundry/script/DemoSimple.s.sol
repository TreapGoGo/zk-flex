// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {WealthProofRegistry} from "../contracts/WealthProofRegistry.sol";
import {WealthProofInstance} from "../contracts/WealthProofInstance.sol";

/**
 * @title DemoSimple  
 * @notice Simplified demo script - clean output, easy to understand
 * 
 * Usage:
 *   Terminal 1: yarn chain
 *   Terminal 2: forge script script/DemoSimple.s.sol --fork-url http://localhost:8545 --broadcast
 */
contract DemoSimple is Script {
    
    function run() public {
        console.log("");
        console.log("==================================================");
        console.log("          ZK FLEX DEMO - FULL WALKTHROUGH        ");
        console.log("==================================================");
        console.log("");
        
        vm.startBroadcast();
        
        // STEP 1: Deploy
        console.log("[1/5] Deploying contracts...");
        WealthProofRegistry registry = new WealthProofRegistry();
        console.log("      Registry deployed:", address(registry));
        console.log("      Verifier deployed:", address(registry.verifier()));
        console.log("");
        
        // STEP 2: Create wallet pool
        console.log("[2/5] Bob creates wallet pool instance...");
        address[32] memory pool = _makeWalletPool();
        console.log("      Pool: 32 addresses");
        console.log("      Bob_real: position 15 (HIDDEN)");
        
        address instance = registry.createProofInstance(pool);
        console.log("      Instance:", instance);
        console.log("");
        
        // STEP 3: Check snapshot
        console.log("[3/5] Snapshot created");
        WealthProofInstance inst = WealthProofInstance(instance);
        console.log("      Block:", inst.getLatestSnapshot().blockNumber);
        console.log("");
        
        vm.stopBroadcast();
        
        // STEP 4: Proof generation (explanation)
        console.log("[4/5] Proof generation (in browser)");
        console.log("      - MetaMask signs message");
        console.log("      - Browser runs snarkjs");
        console.log("      - Time: 30-60 seconds");
        console.log("      - Output: proof.json");
        console.log("");
        
        // STEP 5: Verification (explanation)
        console.log("[5/5] Proof verification");
        console.log("      - Alice calls verifyProof()");
        console.log("      - FREE (view function)");
        console.log("      - Result: VALID/INVALID");
        console.log("");
        
        // Summary
        console.log("==================================================");
        console.log("                    SUMMARY                       ");
        console.log("==================================================");
        console.log("");
        console.log("Contracts:");
        console.log("  Registry:", address(registry));
        console.log("  Instance:", instance);
        console.log("");
        console.log("Privacy:");
        console.log("  - 32 addresses (anonymity set)");
        console.log("  - Bob hidden among them");
        console.log("  - Guess probability: 3.125%");
        console.log("");
        console.log("Performance:");
        console.log("  - Proof size: 288 bytes");
        console.log("  - Proof time: 30-60s");
        console.log("  - Verify cost: FREE");
        console.log("");
        console.log("==================================================");
        console.log("");
    }
    
    function _makeWalletPool() internal pure returns (address[32] memory) {
        address[32] memory p;
        // Anvil accounts 0-9
        p[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        p[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        p[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        p[3] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        p[4] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        p[5] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        p[6] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        p[7] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        p[8] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        p[9] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        
        // Fill rest
        for (uint i = 10; i < 32; i++) {
            if (i == 15) {
                p[i] = p[5]; // Bob_real at 15
            } else {
                p[i] = address(uint160(0x2000 + i));
            }
        }
        return p;
    }
}

