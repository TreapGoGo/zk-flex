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
        
        // STEP 0: Setup test balances (before broadcast)
        console.log("[0/6] Setup: Funding test wallets...");
        _fundTestWallets();
        console.log("      9 Anvil accounts funded with test ETH");
        console.log("");
        
        vm.startBroadcast();
        
        // STEP 1: Deploy
        console.log("[1/6] Deploying contracts...");
        WealthProofRegistry registry = new WealthProofRegistry();
        console.log("      Registry deployed:", address(registry));
        console.log("      Verifier deployed:", address(registry.verifier()));
        console.log("");
        
        // STEP 2: Create wallet pool
        console.log("[2/6] Bob creates wallet pool instance...");
        address[32] memory pool = _makeWalletPool();
        
        address bobReal = pool[15];
        console.log("      Pool: 32 addresses");
        console.log("      Bob_real:", bobReal, "(at position 15)");
        console.log("      Bob_real balance:", bobReal.balance / 1 ether, "ETH");
        console.log("");
        
        address instance = registry.createProofInstance(pool);
        console.log("      Instance created:", instance);
        console.log("");
        
        // STEP 3: Check snapshot
        console.log("[3/6] Balance snapshot created");
        WealthProofInstance inst = WealthProofInstance(instance);
        WealthProofInstance.Snapshot memory snap = inst.getLatestSnapshot();
        
        console.log("      Snapshot block:", snap.blockNumber);
        console.log("      Snapshot time:", snap.timestamp);
        console.log("");
        console.log("      Balance preview:");
        console.log("        [0]", snap.balances[0] / 1 ether, "ETH");
        console.log("        [1]", snap.balances[1] / 1 ether, "ETH");
        console.log("        [2]", snap.balances[2] / 1 ether, "ETH");
        console.log("        ...");
        console.log("        [15] (Bob_real)", snap.balances[15] / 1 ether, "ETH");
        console.log("        ...");
        console.log("");
        
        vm.stopBroadcast();
        
        // STEP 4: Proof generation (explanation)
        console.log("[4/6] Proof generation (in browser, off-chain)");
        console.log("      What Bob does:");
        console.log("        1. Switch to Bob_real wallet in MetaMask");
        console.log("        2. Sign message: 'ZK Flex Proof'");
        console.log("        3. Browser generates ZK proof:");
        console.log("           - Loads circuit files (5-10s)");
        console.log("           - Computes witness");
        console.log("           - Runs Groth16 prover (20-50s)");
        console.log("        4. Downloads proof.json (288 bytes)");
        console.log("");
        console.log("      Private inputs (hidden in proof):");
        console.log("        - Signature from Bob_real");
        console.log("        - walletIndex = 15");
        console.log("        - Bob_real address");
        console.log("");
        console.log("      Public inputs (visible in proof):");
        console.log("        - Message hash");
        console.log("        - 32 addresses");
        console.log("        - 32 balances");
        console.log("        - Threshold (e.g., 1000 ETH)");
        console.log("");
        
        // STEP 5: Verification (explanation)
        console.log("[5/6] Proof verification (FREE)");
        console.log("      What Alice does:");
        console.log("        1. Receives proof.json from Bob");
        console.log("        2. Uploads to frontend");
        console.log("        3. Frontend calls: instance.verifyProof()");
        console.log("           - VIEW function (no transaction)");
        console.log("           - No Gas cost");
        console.log("           - Instant result");
        console.log("");
        console.log("      Result: VALID");
        console.log("");
        console.log("      What Alice learns:");
        console.log("        [YES] Someone in the 32-address pool");
        console.log("        [YES] Has balance >= threshold");
        console.log("        [NO]  Does NOT know WHO");
        console.log("        [NO]  Does NOT know exact balance");
        console.log("");
        
        // STEP 6: Privacy analysis
        console.log("[6/6] Privacy analysis");
        console.log("      Chain data (PUBLIC):");
        console.log("        - Bob_proxy created this instance");
        console.log("        - Instance contains 32 addresses");
        console.log("        - Each address's balance at block", snap.blockNumber);
        console.log("");
        console.log("      Hidden data (PRIVATE):");
        console.log("        - Which address is Bob_real? (1/32 chance)");
        console.log("        - Bob's wallet index? (Never revealed)");
        console.log("        - Bob's signature? (Only in browser)");
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
        
        // Define Bob_real (Anvil Account #5)
        address bobReal = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        
        // Use Anvil accounts 0-4, 6-9 (skip #5, will use for Bob at position 15)
        p[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Anvil #0
        p[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Anvil #1
        p[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Anvil #2
        p[3] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906; // Anvil #3
        p[4] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65; // Anvil #4
        p[5] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9; // Anvil #6
        p[6] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955; // Anvil #7
        p[7] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f; // Anvil #8
        p[8] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720; // Anvil #9
        
        // Fill positions 9-14 and 16-31 with generated addresses
        for (uint i = 9; i < 32; i++) {
            if (i == 15) {
                p[i] = bobReal; // Bob_real ONLY at position 15
            } else {
                p[i] = address(uint160(uint256(keccak256(abi.encodePacked("addr", i)))));
            }
        }
        
        return p;
    }
    
    /**
     * @notice Fund test wallets with ETH for realistic demo
     * @dev Uses vm.deal cheatcode to give addresses test ETH
     */
    function _fundTestWallets() internal {
        // Fund Anvil accounts with varying amounts (simulate real scenario)
        vm.deal(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 100000 ether);  // Anvil #0 - Large holder
        vm.deal(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 50000 ether);   // Anvil #1 - Medium
        vm.deal(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, 25000 ether);   // Anvil #2 
        vm.deal(0x90F79bf6EB2c4f870365E785982E1f101E93b906, 10000 ether);   // Anvil #3
        vm.deal(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, 5000 ether);    // Anvil #4
        
        // Bob_real (Anvil #5) - The address Bob wants to prove ownership of
        vm.deal(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc, 15000 ether);   // Bob_real - Target balance
        
        vm.deal(0x976EA74026E726554dB657fA54763abd0C3a0aa9, 8000 ether);    // Anvil #6
        vm.deal(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955, 3000 ether);    // Anvil #7
        vm.deal(0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f, 1000 ether);    // Anvil #8
        vm.deal(0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 500 ether);     // Anvil #9
    }
}

