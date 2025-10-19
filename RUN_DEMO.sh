#!/bin/bash

# ZK Flex - 一键启动 Demo 脚本
# 用途：确保所有步骤都能正确执行

set -e

echo "=========================================="
echo "     ZK FLEX - ONE-CLICK DEMO SETUP"
echo "=========================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# 检查链是否启动
echo "[1/3] Checking if Anvil is running..."
if curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "      ✓ Anvil is running"
else
    echo "      ✗ Anvil not running!"
    echo ""
    echo "Please start Anvil in another terminal:"
    echo "  yarn chain"
    echo ""
    echo "Then re-run this script."
    exit 1
fi

# 部署合约（使用 forge 直接命令）
echo ""
echo "[2/3] Deploying contracts..."
cd packages/foundry

forge script script/Deploy.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast

if [ $? -eq 0 ]; then
    echo "      ✓ Contracts deployed!"
else
    echo "      ✗ Deployment failed!"
    exit 1
fi

# 生成 TypeScript ABIs
echo ""
echo "[3/3] Generating TypeScript ABIs..."
cd ../..
yarn contracts:build

echo ""
echo "=========================================="
echo "         DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Deployed contracts:"
echo "  Check: packages/foundry/broadcast/Deploy.s.sol/31337/run-latest.json"
echo ""
echo "Next steps:"
echo "  1. yarn start (in another terminal)"
echo "  2. Visit http://localhost:3000"
echo "  3. Test Bob page: http://localhost:3000/zk-flex/bob"
echo "  4. Test Alice page: http://localhost:3000/zk-flex/alice"
echo ""
echo "=========================================="

