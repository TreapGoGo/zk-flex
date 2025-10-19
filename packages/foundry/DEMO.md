# ZK Flex - Demo 演示指南

## 🎯 快速开始（一键演示）

### 完整 Demo 演示

```bash
# Terminal 1: 启动本地链
yarn chain

# Terminal 2: 运行完整 Demo
forge script script/RunFullDemo.s.sol --fork-url http://localhost:8545 --broadcast -vvv
```

**这个脚本会自动执行**：
- ✅ 部署 Registry 和 Verifier
- ✅ 创建包含 32 个地址的钱包池实例
- ✅ 创建余额快照
- ✅ 模拟证明生成过程（说明性）
- ✅ 模拟证明验证过程
- ✅ 展示完整的隐私保护机制

---

## 📋 分步演示（理解每个阶段）

### 步骤 1: 部署 Registry

```bash
forge script script/01_DeployRegistry.s.sol --fork-url http://localhost:8545 --broadcast -vv
```

**输出**：
- Registry 地址
- Verifier 地址
- 下一步指示

**理解**：
- Registry 是工厂合约，管理所有实例
- Verifier 是共享的 Groth16 验证器
- 一个 Registry 可以创建无限个 Instance

---

### 步骤 2: 创建实例（Bob 的操作）

```bash
# 设置 Registry 地址（从步骤 1 获取）
export REGISTRY_ADDRESS=0x...

forge script script/02_CreateInstance.s.sol --fork-url http://localhost:8545 --broadcast -vv
```

**输出**：
- Instance 地址
- 钱包池预览（32 个地址）
- 余额快照预览
- Bob_real 的位置（仅演示脚本可见）

**理解**：
- Bob_proxy 发起交易创建实例
- Bob_real 地址混在 32 个地址中
- 链上数据无法区分哪个是 Bob_real
- 快照记录了所有地址在某个区块的余额

---

### 步骤 3: 模拟证明生成（说明性）

```bash
# 设置 Instance 地址（从步骤 2 获取）
export INSTANCE_ADDRESS=0x...

forge script script/03_SimulateProofGeneration.s.sol --fork-url http://localhost:8545 -vv
```

**输出**：
- 详细的证明生成流程说明
- 每个步骤的时间消耗
- 私有输入和公开输入的区别
- ZK 隐私保护的原理

**理解**：
- 这个脚本不会真的生成证明（需要前端）
- 但会详细解释证明生成的每个步骤
- 适合向观众讲解技术原理

---

### 步骤 4: 模拟证明验证（Alice 的操作）

```bash
forge script script/04_VerifyProof.s.sol --fork-url http://localhost:8545 -vv
```

**输出**：
- Alice 的验证流程
- view 函数调用（免费）
- Alice 能知道什么 / 不能知道什么

**理解**：
- verifyProof() 是 view 函数，完全免费
- 不需要 MetaMask 签名
- Alice 无法得知 Bob_real 的具体地址

---

## 🎬 Hackathon 现场演示流程

### 准备阶段（Pitch 前 5 分钟）

```bash
# Terminal 1
cd ~/ethshanghai/zk-flex
yarn chain

# 等待链启动...

# Terminal 2
forge script script/RunFullDemo.s.sol --fork-url http://localhost:8545 --broadcast

# 记下输出的 Instance 地址
```

### Pitch 演示（评委面前）

```
时间线：2 分钟完整演示

[0:00-0:15] 介绍问题
  "Web3 的困境：透明性 vs 隐私性"
  
[0:15-0:30] 展示合约部署
  切换到 Terminal，展示刚才运行的输出：
  ✅ Registry deployed
  ✅ Instance created with 32 addresses
  ✅ Balance snapshot created

[0:30-1:00] 解释核心技术
  指向控制台输出：
  "看这里，Bob_real 在第 15 个位置"
  "但在链上数据中，32 个地址完全无法区分"
  "这就是匿名集的概念"

[1:00-1:30] 解释 ZK 证明
  "Bob 在浏览器中："
  1. MetaMask 签名（展示签名弹窗截图）
  2. 生成 ZK 证明（展示进度条动画）
  3. 证明包含 1.88M 个约束
  4. 耗时 30-60 秒

[1:30-2:00] 展示验证结果
  "Alice 验证时："
  - 调用 view 函数（免费）
  - 知道：某人余额够
  - 不知道：具体是谁
  - 完美的隐私保护！
```

---

## 🔧 高级用法

### 自定义钱包池

编辑 `HelperConfig.s.sol`：
```solidity
// 添加你想要的知名地址
wellKnown[0] = 0x...; // 某个大户
wellKnown[1] = 0x...; // 某个项目
```

### 切换到 Sepolia 测试网

```bash
# 1. 设置环境变量
export SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
export PRIVATE_KEY=0x...

# 2. 运行脚本
forge script script/01_DeployRegistry.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 📊 预期输出示例

### RunFullDemo.s.sol 完整输出

```
╔════════════════════════════════════════╗
║                                        ║
║         ZK FLEX FULL DEMO              ║
║   Privacy-Preserving Wealth Proof     ║
║                                        ║
╚════════════════════════════════════════╝

Network: Anvil Local
Chain ID: 31337
Block Number: 1

========================================

========================================
PHASE 1 : Deploy Registry
========================================

Deploying WealthProofRegistry...

Deployed:
  Registry: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Verifier: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

========================================
PHASE 2 : Bob Creates Wallet Pool Instance
========================================

Bob's Setup:
  Bob_proxy (tx sender): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  Bob_real (hidden): 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
  Bob's position: 15 / 32

Wallet Pool (preview):
  [0] 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  [1] 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  ...
  [ 15 ] 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc <-- Bob_real (HIDDEN)
  ...
  [31] 0xa3e...

Creating instance...

Instance created: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

========================================
PHASE 3 : View Balance Snapshot
========================================

Snapshot created at:
  Block: 2
  Time: 1697234567

Balance Snapshot:
  [ 0 ] 10000 ETH
  [ 1 ] 10000 ETH
  [ 2 ] 10000 ETH
  ...
  [ 15 ] 10000 ETH
  ...
  [ 31 ] 10000 ETH

Total in pool: 320000 ETH
Bob_real balance: 10000 ETH

========================================
PHASE 4 : Bob Generates ZK Proof (Off-chain)
========================================

This happens in the BROWSER:

  1. Bob signs message with Bob_real
     - MetaMask popup
     - Time: <1 second

  2. Browser loads circuit files
     - From localhost (Demo) or CDN (Production)
     - Time: 5-10 seconds

  3. Browser generates proof
     - snarkjs + WASM
     - ~1.88M constraints
     - Time: 30-60 seconds
     - Progress bar: 0%... 25%... 50%... 75%... 100%

  4. Download proof.json (288 bytes)

Private inputs used (never exposed):
  - Signature
  - walletIndex = 15
  - Bob_real = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc

ZK Magic: These inputs are used in the circuit,
but the proof doesn't reveal them!

========================================
PHASE 5 : Alice Verifies Proof (FREE)
========================================

Alice's actions:
  1. Upload proof.json
  2. Frontend calls instance.verifyProof()
     - VIEW function (no transaction)
     - No Gas cost
     - Instant result

Verification result: VALID ✅

What this means:
  ✅ Proof is mathematically correct
  ✅ Someone in the 32-address pool
  ✅ Has balance >= threshold
  ✅ At the snapshot block

  ❌ Alice doesn't know WHO
  ❌ Alice doesn't know EXACT balance

========================================
DEMO SUMMARY
========================================

Contracts:
  Registry: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Verifier: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  Instance: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

Demo Scenario:
  Bob_real: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
  Position: 15 / 32 (PRIVATE)
  Anonymity set: 32 addresses
  Success rate (random guess): 3.125%

Gas Costs:
  Deploy Registry: ~800k gas
  Create Instance: ~500k gas
  Verify Proof: FREE (view function)

Performance:
  Proof generation: 30-60 seconds
  Proof verification: Instant (on-chain)
  Proof size: 288 bytes

========================================

Next Steps for Frontend:
  1. yarn start
  2. Navigate to /bob
  3. Connect MetaMask
  4. Use Instance: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

========================================
```

---

## 🧪 测试脚本

### 验证脚本编译

```bash
forge build
```

### 运行单个脚本

```bash
# 部署
forge script script/01_DeployRegistry.s.sol --fork-url http://localhost:8545 --broadcast

# 创建实例
export REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
forge script script/02_CreateInstance.s.sol --fork-url http://localhost:8545 --broadcast

# 查看说明
export INSTANCE_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
forge script script/03_SimulateProofGeneration.s.sol --fork-url http://localhost:8545

# 验证
forge script script/04_VerifyProof.s.sol --fork-url http://localhost:8545
```

---

## 💡 脚本设计理念

### HelperConfig.s.sol
- **用途**：网络配置管理
- **功能**：
  - 自动检测网络（Anvil / Sepolia）
  - 提供网络特定的知名地址
  - 生成测试钱包池

### 01_DeployRegistry.s.sol
- **用途**：部署入口合约
- **输出**：Registry 和 Verifier 地址
- **适合**：初始化系统

### 02_CreateInstance.s.sol
- **用途**：创建钱包池实例
- **输出**：Instance 地址和快照数据
- **适合**：演示匿名集概念

### 03_SimulateProofGeneration.s.sol
- **用途**：详细说明证明生成
- **输出**：流程讲解
- **适合**：技术讲解

### 04_VerifyProof.s.sol
- **用途**：演示验证过程
- **输出**：验证结果和隐私分析
- **适合**：展示最终效果

### RunFullDemo.s.sol
- **用途**：一键完整演示
- **输出**：所有阶段的详细日志
- **适合**：快速展示和测试

---

## 🎨 输出格式说明

### 彩色输出和格式

脚本使用 Foundry 的 console.log 提供：
- ✅ 清晰的阶段划分
- ✅ 详细的步骤说明
- ✅ 数据预览
- ✅ 下一步指示

### 信息层次

```
========================================  # 主要阶段
PHASE N : Title
========================================

  段落说明
  
  缩进数据：
    - 列表项
    
  子步骤：
    1. 步骤一
    2. 步骤二

----------------------------------------  # 子部分
```

---

## 🔍 调试技巧

### 查看详细日志

```bash
# -vvv = 最详细的日志
forge script script/RunFullDemo.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast \
  -vvvv
```

### 不广播（只模拟）

```bash
# 移除 --broadcast 只模拟执行
forge script script/RunFullDemo.s.sol \
  --fork-url http://localhost:8545
```

### Gas 报告

```bash
forge script script/02_CreateInstance.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast \
  --gas-report
```

---

## 📱 前端集成

### 使用脚本输出的地址

```typescript
// packages/nextjs/app/bob/page.tsx

// 从 Demo 脚本获取
const INSTANCE_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// 使用 Scaffold-ETH hooks
const { data: snapshot } = useScaffoldReadContract({
  contractName: "WealthProofInstance",
  address: INSTANCE_ADDRESS,
  functionName: "getLatestSnapshot"
});
```

---

## 🎯 Hackathon Pitch 使用建议

### Pitch 中的脚本使用时机

**开场（30秒）**：
- 展示问题："Web3 隐私困境"

**技术演示（1分钟）**：
- 切换到 Terminal
- 展示 `RunFullDemo.s.sol` 的输出
- 指向关键部分：
  - "看这里，Bob_real 在第 15 个位置"
  - "但在链上，32 个地址无法区分"

**技术深度（30秒）**：
- 指向约束数："`~1.88M 约束`"
- "这是 150 万次椭圆曲线运算"
- "用 30 秒换来永久隐私"

**总结（30秒）**：
- 切回 PPT
- Call to Action

---

## 📚 参考资料

- [Foundry Script 文档](https://book.getfoundry.sh/tutorials/solidity-scripting)
- [Forge 命令参考](https://book.getfoundry.sh/reference/forge/forge-script)
- [PRODUCT.md](../../PRODUCT.md) - 完整产品规格
- [ROADMAP.md](../../ROADMAP.md) - 开发进度

