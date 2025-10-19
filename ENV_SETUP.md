# 环境变量配置指南

## 📝 配置你的钱包地址

### 1. Foundry 环境变量

编辑 `packages/foundry/.env`：

```bash
# Bob 的真实钱包（要证明的地址）
# 这个地址会被混在 32 个地址中，保持隐私
BOB_REAL_ADDRESS=0x你的地址

# Bob 的代理钱包（发送链上交易）
# 用于创建实例等操作，可以暴露
BOB_PROXY_ADDRESS=0x你的小号地址

# Alice 的地址（验证者）
# 用于演示验证流程
ALICE_ADDRESS=0x另一个地址
```

### 2. Next.js 环境变量（可选）

编辑 `packages/nextjs/.env.local`：

```bash
# 如果需要前端也使用这些地址
NEXT_PUBLIC_BOB_REAL_ADDRESS=0x...
NEXT_PUBLIC_BOB_PROXY_ADDRESS=0x...
NEXT_PUBLIC_ALICE_ADDRESS=0x...
```

---

## 🎬 使用你自己的地址进行 Demo

### 方法 1：修改 .env 文件

```bash
cd ~/zk-flex

# 编辑 .env
nano packages/foundry/.env

# 修改这三个地址为你的地址：
BOB_REAL_ADDRESS=0x你的主钱包
BOB_PROXY_ADDRESS=0x你的小号
ALICE_ADDRESS=0x朋友的地址

# 保存退出
```

### 方法 2：使用环境变量运行

```bash
export BOB_REAL_ADDRESS=0x你的地址
export BOB_PROXY_ADDRESS=0x小号地址
export ALICE_ADDRESS=0x朋友地址

# 运行 Demo
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast
```

---

## 🔍 地址用途说明

### Bob_real

```
用途：要证明的钱包地址
特点：
  - 持有大额资产（如 15,000 ETH）
  - 会被混在 32 个地址中（位置 15）
  - 在链上不会暴露是 Bob 的地址
  - 只在生成 ZK 证明时使用（浏览器本地）

安全性：
  ✅ 不会在链上发送任何交易
  ✅ 只是被动地出现在地址池中
  ✅ 和其他 31 个地址无法区分
```

### Bob_proxy

```
用途：代理钱包，发送链上交易
特点：
  - 余额较少（如 100 ETH，仅够 gas）
  - 用于创建实例等链上操作
  - 可以公开，无所谓

安全性：
  ✅ 即使暴露也没关系
  ✅ 与 Bob_real 无法关联
  ✅ 只是操作账户
```

### Alice

```
用途：验证者地址
特点：
  - 用于演示验证流程
  - 实际使用时可以是任何人
  
安全性：
  ✅ 只调用 view 函数（免费）
  ✅ 不会暴露 Bob 的信息
```

---

## 🎯 Demo 脚本的地址处理

### DemoSimple.s.sol

脚本会：

1. **从 .env 读取地址**
   ```solidity
   address bobReal = vm.envOr("BOB_REAL_ADDRESS", defaultAddress);
   ```

2. **给地址发送测试 ETH**（仅本地链）
   ```solidity
   vm.deal(bobReal, 15000 ether);
   ```

3. **生成钱包池**（31 个公开地址 + Bob_real）
   ```
   [0] Vitalik
   [1] Binance
   [2] Kraken
   ...
   [15] Bob_real（你的地址）← 隐藏在这里
   ...
   [31] 生成的地址
   ```

4. **使用 Bob_proxy 创建实例**
   ```
   交易发送者：Bob_proxy
   交易数据：32 个地址（包含 Bob_real）
   ```

---

## 🧪 测试不同场景

### 场景 1：使用默认地址（Anvil 账户）

```bash
# 不修改 .env，直接运行
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast
```

### 场景 2：使用你自己的地址

```bash
# 1. 修改 packages/foundry/.env

# 2. 运行
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast
```

### 场景 3：临时测试其他地址

```bash
export BOB_REAL_ADDRESS=0x临时地址

forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast
```

---

## ⚠️ 注意事项

### 本地链 vs 测试网

**本地链（Anvil）**：
- ✅ 可以使用 vm.deal 任意发送 ETH
- ✅ 可以使用任何地址
- ✅ 适合 Demo 演示

**测试网（Sepolia）**：
- ❌ 不能使用 vm.deal
- ⚠️ 需要地址有真实的 ETH
- ⚠️ 需要从 faucet 获取测试币

### 隐私提醒

```
Bob_real 地址会：
  ✅ 出现在钱包池参数中（公开）
  ✅ 但混在 31 个其他地址中
  ✅ 链上无法区分是 Bob 的

Bob_proxy 地址会：
  ✅ 作为交易发送者（公开）
  ✅ 但这不重要（是代理账户）

所以：
  ✅ 使用真实地址是安全的
  ✅ 隐私得到保护
```

---

## 🎯 快速配置命令

```bash
# 创建 .env 文件
cat > packages/foundry/.env << 'EOF'
BOB_REAL_ADDRESS=0x你的主钱包地址
BOB_PROXY_ADDRESS=0x你的小号地址
ALICE_ADDRESS=0x朋友的地址
ETH_KEYSTORE_ACCOUNT=
EOF

# 运行 Demo
yarn chain  # Terminal 1
# 等链启动...
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast
```

---

**现在脚本会自动使用你的地址进行 Demo！** ✅

