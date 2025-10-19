// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import { WealthProofRegistry } from "../contracts/WealthProofRegistry.sol";

contract DeployWealthProof is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // 部署 Registry（会自动部署 Verifier 和 Instance 工厂）
        WealthProofRegistry registry = new WealthProofRegistry();
        
        console.logString(
            string.concat(
                "WealthProofRegistry deployed at: ",
                vm.toString(address(registry))
            )
        );
        
        console.logString(
            string.concat(
                "Groth16Verifier deployed at: ",
                vm.toString(address(registry.verifier()))
            )
        );
        
        // 导出部署信息
        exportDeployments();
    }
}

