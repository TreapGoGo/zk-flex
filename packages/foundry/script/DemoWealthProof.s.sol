// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/WealthProofRegistry.sol";
import "../contracts/WealthProofInstance.sol";

/**
 * @title DemoWealthProof
 * @notice Demo 演示脚本 - 展示完整的验资流程
 * @dev 包含 mock 数据，用于 Hackathon 演示
 */
contract DemoWealthProof is Script {
    
    // 知名地址（用于 Demo）
    address constant VITALIK = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
    address constant UNISWAP_DAO = 0x1a9C8182C09F50C8318d769245beA52c32BE35BC;
    address constant MAKER_DAO = 0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2;
    
    function run() public {
        console.log("========================================");
        console.log("ZK Flex Demo - 隐私验资协议演示");
        console.log("========================================");
        console.log("");
        
        // 开始演示
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // 步骤 1: 部署 Registry
        console.log("Step 1: 部署 WealthProofRegistry...");
        WealthProofRegistry registry = new WealthProofRegistry();
        console.log("  Registry:", address(registry));
        console.log("  Verifier:", address(registry.verifier()));
        console.log("");
        
        // 步骤 2: 创建测试钱包池（Bob 的操作）
        console.log("Step 2: Bob 创建钱包池实例...");
        address[32] memory walletPool = _createDemoWalletPool();
        
        console.log("  钱包池包含 32 个地址：");
        console.log("    [0] Vitalik:", walletPool[0]);
        console.log("    [1] Uniswap DAO:", walletPool[1]);
        console.log("    [2] Maker DAO:", walletPool[2]);
        console.log("    ...");
        console.log("    [15] Bob_real (混在其中):", walletPool[15]);
        console.log("    ...");
        console.log("    [31] 测试地址:", walletPool[31]);
        console.log("");
        
        address instance = registry.createProofInstance(walletPool);
        console.log("  Instance created:", instance);
        console.log("");
        
        // 步骤 3: 查看快照
        console.log("Step 3: 查看余额快照...");
        WealthProofInstance proofInstance = WealthProofInstance(instance);
        WealthProofInstance.Snapshot memory snapshot = proofInstance.getLatestSnapshot();
        
        console.log("  快照区块:", snapshot.blockNumber);
        console.log("  快照时间:", snapshot.timestamp);
        console.log("  示例余额：");
        for (uint256 i = 0; i < 5; i++) {
            console.log("    [", i, "]", snapshot.balances[i], "wei");
        }
        console.log("    ...");
        console.log("");
        
        vm.stopBroadcast();
        
        // 步骤 4: 说明后续流程（链下）
        console.log("Step 4: Bob 生成 ZK 证明（链下）");
        console.log("  - Bob_real 在 MetaMask 中签名");
        console.log("  - 浏览器端生成 ZK 证明（30-60 秒）");
        console.log("  - 下载 proof.json");
        console.log("");
        
        console.log("Step 5: Alice 验证证明（免费）");
        console.log("  - 上传 proof.json");
        console.log("  - 调用 instance.verifyProof() (view 函数)");
        console.log("  - 查看结果：✅ 某人余额足够 / ❌ 证明无效");
        console.log("");
        
        console.log("========================================");
        console.log("Demo 演示完成！");
        console.log("========================================");
    }
    
    /**
     * @notice 创建演示用的钱包池
     * @dev 包含知名地址 + 测试地址
     */
    function _createDemoWalletPool() internal pure returns (address[32] memory) {
        address[32] memory pool;
        
        // 前 3 个：知名地址
        pool[0] = VITALIK;
        pool[1] = UNISWAP_DAO;
        pool[2] = MAKER_DAO;
        
        // 其余：生成测试地址
        for (uint256 i = 3; i < 32; i++) {
            pool[i] = address(uint160(0x10000 + i));
        }
        
        return pool;
    }
}

