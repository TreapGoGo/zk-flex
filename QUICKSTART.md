# ZK Flex - 快速启动指南

## 🚀 10 分钟上手 ZK Flex

### 前置要求

```bash
# 检查环境
node --version   # >= v20.18.3
yarn --version   # >= 1.0.0
forge --version  # Foundry 已安装
```

---

## 📦 方式 1：快速 Demo（推荐）

### 一键启动完整系统

```bash
# 1. Clone 代码
git clone https://github.com/TreapGoGo/zk-flex.git
cd zk-flex

# 2. 安装依赖
yarn install

# 3. 启动本地链（Terminal 1）
yarn chain

# 4. 运行 Demo（Terminal 2）
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast

# 输出会显示：
# - Registry 地址
# - Instance 地址  
# - 完整演示流程
# - 下一步指示
```

**预期输出**：

```
==================================================
          ZK FLEX DEMO - FULL WALKTHROUGH        
==================================================

[1/5] Deploying contracts...
      Registry deployed: 0x5FbDB...
      Verifier deployed: 0xe7f17...

[2/5] Bob creates wallet pool instance...
      Pool: 32 addresses
      Bob_real: position 15 (HIDDEN)
      Instance: 0x9fE46...

[3/5] Snapshot created
      Block: 2

[4/5] Proof generation (in browser)
      - MetaMask signs message
      - Browser runs snarkjs
      - Time: 30-60 seconds
      - Output: proof.json

[5/5] Proof verification
      - Alice calls verifyProof()
      - FREE (view function)
      - Result: VALID/INVALID

==================================================
                    SUMMARY                       
==================================================

Contracts:
  Registry: 0x5FbDB...
  Instance: 0x9fE46...

Privacy:
  - 32 addresses (anonymity set)
  - Bob hidden among them
  - Guess probability: 3.125%

Performance:
  - Proof size: 288 bytes
  - Proof time: 30-60s
  - Verify cost: FREE

==================================================
```

---

## 📦 方式 2：完整开发环境

### 如果需要生成电路文件

```bash
# 1. 安装 Circom
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
git clone https://github.com/iden3/circom.git
cd circom && cargo build --release && cargo install --path circom

# 2. 生成电路文件（耗时 15-20 分钟）
cd ~/zk-flex
./scripts/setup-circuits.sh

# 这会下载并生成：
# - Powers of Tau 21 (2.3GB)
# - wealth_proof_final.zkey (919MB)
# - wealth_proof.wasm (12MB)
# - Groth16Verifier.sol

# 3. 启动完整系统
yarn chain    # Terminal 1
yarn deploy   # Terminal 2  
yarn start    # Terminal 3
```

---

## 🎬 Pitch 演示流程（Hackathon）

### 准备（Pitch 前 5 分钟）

```bash
# Terminal 1: 启动本地链
cd ~/zk-flex
yarn chain

# Terminal 2: 运行 Demo
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast

# 记下 Instance 地址（后面会用到）
```

### Pitch 现场（2 分钟）

**[0-30s] 问题引入**
- PPT：Web3 隐私困境

**[30s-1min] 技术演示**
- 切到 Terminal
- 展示 Demo 输出
- 指向关键点：
  - "32 个地址"
  - "Bob 在第 15 个"
  - "链上无法区分"

**[1min-1.5min] 技术深度**
- PPT：流程图
- 强调：
  - "1.88M 约束"
  - "30 秒证明"
  - "免费验证"

**[1.5min-2min] 总结**
- 回到 Demo 输出
- 指向 Summary
- Call to Action

---

## 🧪 测试合约功能

### 运行单元测试

```bash
cd packages/foundry
forge test

# 应该看到：
# [PASS] testCreateInstance
# [PASS] testMultipleInstances
# [PASS] testSnapshotCreation
# [PASS] testInvalidWalletPool
# Suite result: ok. 4 passed
```

### Gas 报告

```bash
forge test --gas-report

# 查看每个函数的 gas 消耗
```

---

## 🔧 常见问题

### Q: Demo 脚本运行失败？

```bash
# 确保本地链正在运行
yarn chain

# 确认链已启动（另一个终端）
curl http://localhost:8545 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1"}'
```

### Q: 找不到 Instance 地址？

```bash
# Demo 输出的最后会显示 Instance 地址
# 或者查询 Registry

cast call <REGISTRY_ADDRESS> "getAllInstances()" \
  --rpc-url http://localhost:8545
```

### Q: 想看详细日志？

```bash
# 添加 -vvv 参数
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast \
  -vvv
```

---

## 📚 下一步

### 理解系统

1. 阅读 [PRODUCT.md](../PRODUCT.md) - 完整产品规格
2. 查看 [ROADMAP.md](../ROADMAP.md) - 开发进度
3. 研究 [packages/foundry/contracts/](../packages/foundry/contracts/) - 合约源码

### 前端集成

1. 启动前端：`yarn start`
2. 访问：http://localhost:3000
3. 使用 Demo 输出的 Instance 地址
4. 开始开发 Bob/Alice 界面

### 测试网部署

1. 配置 `.env`
2. 运行：`yarn deploy --network sepolia`
3. 验证：`yarn verify --network sepolia`

---

## 🎯 Demo 脚本输出解读

### 关键信息

```
Instance: 0x9fE46...
```
👆 **这个地址很重要**
- 前端需要这个地址与合约交互
- Alice 需要这个地址验证证明
- 记录下来供后续使用

### 隐私分析

```
Bob_real: position 15 (HIDDEN)
Anonymity set: 32 addresses
Guess probability: 3.125%
```
👆 **隐私保护的核心**
- Bob 混在 32 个地址中
- 观察者只有 3.125% 概率猜对
- 这就是匿名集的价值

### 性能指标

```
Proof time: 30-60s
Verify cost: FREE
```
👆 **用户体验关键点**
- 证明生成需要时间（技术限制）
- 但验证完全免费（产品优势）
- Pitch 时强调这个权衡

---

**准备好开始了吗？运行 Demo 脚本试试！** 🚀

