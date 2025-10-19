// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {WealthProofRegistry} from "../contracts/WealthProofRegistry.sol";

/**
 * @title Deploy
 * @notice 主部署脚本 - 用于 yarn deploy
 * @dev 部署 WealthProofRegistry，Scaffold-ETH 会自动生成 deployedContracts.ts
 */
contract Deploy is Script {
    
    function run() external {
        vm.startBroadcast();
        
        console.log("Deploying WealthProofRegistry...");
        WealthProofRegistry registry = new WealthProofRegistry();
        
        console.log("");
        console.log("Deployment Complete!");
        console.log("====================");
        console.log("Registry:", address(registry));
        console.log("Verifier:", address(registry.verifier()));
        console.log("");
        
        vm.stopBroadcast();
    }
}

