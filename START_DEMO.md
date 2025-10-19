# ZK Flex - Demo 启动指南

> 🎯 一步步启动完整系统，准备 Hackathon 演示

---

## ✅ 前提检查

```bash
# 确保在项目根目录
cd ~/zk-flex

# 检查依赖
node --version   # >= v20.18.3
yarn --version   # >= 1.0.0
forge --version  # Foundry 已安装
```

---

## 🚀 三步启动（推荐）

### Step 1: 启动本地链（Terminal 1）

```bash
cd ~/zk-flex
yarn chain
```

**预期输出**：
```
Listening on 127.0.0.1:8545
```

⚠️ **保持这个终端运行！不要关闭！**

---

### Step 2: 运行 Demo 脚本（Terminal 2）

**等待 Step 1 的链启动完成后**（约 5 秒），打开新终端：

```bash
cd ~/zk-flex/packages/foundry

# 使用 Anvil 默认账户运行
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --fork-url http://localhost:8545 \
  --broadcast
```

**预期输出**：
```
==================================================
          ZK FLEX DEMO - FULL WALKTHROUGH        
==================================================

Demo Addresses:
  Bob_real: 0x9965...
  Bob_proxy: 0xf39F...
  Alice: 0x7099...

[0/6] Setup: Funding wallets...
      Bob_real funded: 0x9965... - 15,000 ETH
      Bob_proxy funded: 0xf39F... - 100 ETH (for gas)
      Alice funded: 0x7099... - 50 ETH (for gas)
      5 public addresses funded (whales)
      Demo addresses funded with test ETH

[1/6] Deploying contracts...
      Registry deployed: 0x5b73...
      Verifier deployed: 0xC7f2...

[2/6] Bob creates wallet pool instance...
      Pool: 32 addresses
      Bob_real: 0x9965... (at position 15)
      Bob_real balance: 15000 ETH
      Instance created: 0xdaE9...

[3/6] Balance snapshot created
      Snapshot block: 2
      Snapshot time: 1729...
      
      Balance preview:
        [0] 500000 ETH
        [1] 200000 ETH
        [2] 100000 ETH
        ...
        [15] (Bob_real) 15000 ETH
        ...

[4/6] Proof generation (in browser, off-chain)
      ...

[5/6] Proof verification (FREE)
      ...

[6/6] Privacy analysis
      ...

==================================================
                    SUMMARY                       
==================================================

Contracts:
  Registry: 0x5b73...
  Instance: 0xdaE9...

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

**📋 重要：记下 Instance 地址！** 例如：`0xdaE97900D4B184c5D2012dcdB658c008966466DD`

---

### Step 3: 启动前端（Terminal 3）

**等待 Step 2 完成后**，打开新终端：

```bash
cd ~/zk-flex
yarn start
```

**预期输出**：
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**访问**：
- Landing Page: http://localhost:3000
- Bob 页面: http://localhost:3000/zk-flex/bob
- Alice 页面: http://localhost:3000/zk-flex/alice

---

## 🎬 Pitch 演示流程

### 准备阶段（Pitch 前 3 分钟）

```bash
# Terminal 1
cd ~/zk-flex
yarn chain

# 等待链启动...

# Terminal 2
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --fork-url http://localhost:8545 \
  --broadcast

# 记下 Instance 地址！

# Terminal 3
cd ~/zk-flex
yarn start

# 访问 http://localhost:3000
```

### Pitch 现场（2 分钟）

**[0-15s] 展示 Landing Page**
- 炫酷的背景动画
- "ZK Flex - Privacy-Preserving Wealth Verification"

**[15s-45s] 展示合约部署（Terminal 2）**
- 指向 Demo 输出
- "32 个地址，Bob 在第 15 个"
- "混入 Vitalik、Binance 等知名地址"

**[45s-1:15] 展示 Bob 页面**
- 访问 http://localhost:3000/zk-flex/bob
- 展示 32 地址输入
- "这是创建钱包池的界面"

**[1:15-1:45] 展示 Alice 页面**
- 访问 http://localhost:3000/zk-flex/alice
- 展示验证界面
- "Alice 可以免费验证，但不知道是谁"

**[1:45-2:00] 总结**
- 回到 PPT
- Call to Action

---

## 🔧 故障排除

### 问题 1: Keystore 错误

```bash
Error: Keystore path is a directory
```

**解决**：
```bash
# 使用私钥运行
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --fork-url http://localhost:8545 \
  --broadcast
```

### 问题 2: 连接被拒绝

```bash
Error: Connection refused (os error 111)
```

**解决**：
```bash
# 确保 Terminal 1 的 yarn chain 正在运行
# 检查端口
curl http://localhost:8545
```

### 问题 3: 端口被占用

```bash
# 查找占用 8545 的进程
lsof -i :8545

# 杀死进程
kill -9 <PID>

# 或者重启链
yarn chain
```

---

## 🎯 快速命令参考

### 完整启动（复制粘贴）

```bash
# Terminal 1
cd ~/zk-flex && yarn chain

# Terminal 2（等 5 秒后）
cd ~/zk-flex/packages/foundry && forge script script/DemoSimple.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --fork-url http://localhost:8545 --broadcast

# Terminal 3（等部署完成）
cd ~/zk-flex && yarn start
```

### 使用自己的地址

```bash
# 1. 编辑 .env
nano packages/foundry/.env

# 2. 修改这三行：
BOB_REAL_ADDRESS=0x你的地址
BOB_PROXY_ADDRESS=0x你的小号
ALICE_ADDRESS=0x朋友地址

# 3. 运行（同上）
```

---

## 📊 验证系统运行

### 检查清单

```
✅ Terminal 1: 显示 "Listening on 127.0.0.1:8545"
✅ Terminal 2: 显示 "Instance: 0x..."
✅ Terminal 3: 显示 "ready - started server"
✅ 浏览器: http://localhost:3000 可以访问
✅ Bob 页面: http://localhost:3000/zk-flex/bob 可以访问
✅ Alice 页面: http://localhost:3000/zk-flex/alice 可以访问
```

---

**准备好了吗？按照这个指南启动系统！** 🚀

提示：
- 需要同时开 3 个终端
- 按顺序启动（chain → deploy → start）
- 每步等待前一步完成

