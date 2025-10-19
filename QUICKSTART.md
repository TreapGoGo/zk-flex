# ZK Flex - 快速启动指南

> 🎯 **目标**：10 分钟理解并运行 ZK Flex Demo

---

## 📦 方式 1：快速 Demo（推荐）

### 一键启动

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
```

### 预期输出

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

## 📦 方式 2：生成电路文件（开发者）

```bash
# 仅当需要修改电路时

# 1. 安装 Rust + Circom
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source ~/.cargo/env
git clone https://github.com/iden3/circom.git
cd circom && cargo build --release && cargo install --path circom

# 2. 生成电路文件（15-20 分钟，需 8GB RAM）
cd ~/zk-flex
./scripts/setup-circuits.sh

# 3. 启动系统
yarn chain
yarn deploy
yarn start
```

---

## 🎬 Hackathon Pitch 演示

### 准备（Pitch 前 2 分钟）

```bash
# Terminal 1
cd ~/zk-flex
yarn chain

# Terminal 2（等链启动后）
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast

# 保持这个终端可见！
```

### Pitch 流程（2 分钟）

```
[0-30s] 介绍
  "ZK Flex - 用零知识证明保护 Web3 隐私"

[30s-1min] 演示
  👉 切到 Terminal
  指向输出：
    "32 个地址，Bob 在第 15 个"
    "但链上无法区分"
    "这就是隐私保护"

[1min-1.5min] 技术
  "1.88M 约束，30 秒生成证明"
  "免费验证，完美隐私"

[1.5min-2min] 总结
  回到 PPT
  Call to Action
```

---

## 🧪 测试

### 运行测试

```bash
cd packages/foundry
forge test

# 预期：5/5 测试通过
```

### Gas 报告

```bash
forge test --gas-report
```

---

## 📚 文档导航

| 文档 | 用途 | 适合 |
|------|------|------|
| [README.md](README.md) | 项目介绍 | 所有人 |
| [QUICKSTART.md](QUICKSTART.md) | 快速上手 | 新手 |
| [PRODUCT.md](PRODUCT.md) | 产品规格 | 深入理解 |
| [ROADMAP.md](ROADMAP.md) | 开发进度 | 团队协作 |
| [SLIDES.md](SLIDES.md) | Pitch 大纲 | Branding 团队 |

---

## 🎯 核心文件清单

### 源代码

```
circuits/
├── wealth_proof.circom         # ZK 电路（核心）
├── ecdsa.circom                # ECDSA 验证（依赖）
├── secp256k1.circom            # 椭圆曲线（依赖）
└── ... (其他 circom-ecdsa 组件)

packages/foundry/contracts/
├── WealthProofRegistry.sol     # 工厂合约
├── WealthProofInstance.sol     # 实例合约
└── Groth16Verifier.sol         # ZK 验证器

packages/foundry/script/
└── DemoSimple.s.sol            # 唯一演示脚本

packages/foundry/test/
└── WealthProofRegistry.t.sol   # 测试合约
```

### 配置文件

```
.gitignore                      # Git 忽略规则
.cursor/rules/scaffold-eth.mdc  # 项目开发规则
scripts/setup-circuits.sh       # 电路构建脚本
```

### 文档文件（根目录）

```
README.md           # 项目说明
QUICKSTART.md       # 快速启动（10 分钟上手）
PRODUCT.md          # 产品规格（技术设计）
ROADMAP.md          # 开发路线图（进度追踪）
SLIDES.md           # 演示文稿（Pitch 用）
EXPERT_CONSULTATION.md  # 专家咨询记录
```

---

**清理完成！现在只保留最核心、最有用的文件。** ✅
