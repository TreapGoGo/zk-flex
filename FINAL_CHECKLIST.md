# ZK Flex - 最终检查清单

## 🎯 Hackathon 演示前检查

### ✅ 系统启动（3 步）

#### Step 1: 启动 Anvil（必须先做）

```bash
# Terminal 1
cd ~/zk-flex
yarn chain

# 等待输出：
# ✓ Listening on 127.0.0.1:8545

# 保持这个终端运行！
```

#### Step 2: 部署合约

```bash
# Terminal 2
cd ~/zk-flex/packages/foundry

# 方法 A：直接使用 forge（推荐，避免 keystore 问题）
forge script script/Deploy.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast

# 方法 B：使用 Demo 脚本（会给地址发钱 + 创建实例）
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast

# 预期输出：
# WealthProofRegistry deployed at: 0x...
# Groth16Verifier deployed at: 0x...
```

#### Step 3: 启动前端

```bash
# Terminal 3
cd ~/zk-flex
yarn start

# 等待输出：
# ready - started server on 0.0.0.0:3000
```

---

## 🧪 快速验证（5 分钟）

### 1. Landing Page

```
访问：http://localhost:3000

检查：
✓ 页面加载
✓ 背景动画流畅
✓ "Create Pool" 按钮
✓ "Verify Proof" 按钮
```

### 2. Bob 页面

```
访问：http://localhost:3000/zk-flex/bob

检查：
✓ 32 地址输入显示
✓ "Fill Test Addresses" 按钮工作
✓ "Connect Wallet" 可用
✓ 连接后显示地址
```

### 3. Alice 页面

```
访问：http://localhost:3000/zk-flex/alice

检查：
✓ Instance 地址输入
✓ 文件上传区域
✓ 输入地址后显示数据
```

### 4. Debug 页面（可选）

```
访问：http://localhost:3000/debug

检查：
✓ WealthProofRegistry 合约显示
✓ 可以调用函数
```

---

## 🎬 Pitch 演示流程（2 分钟）

### 准备（Pitch 前 3 分钟）

```bash
# 1. 启动链（Terminal 1）
yarn chain

# 2. 部署并创建实例（Terminal 2）
cd packages/foundry
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast

# 📋 记下 Instance 地址！

# 3. 启动前端（Terminal 3）
cd ~/zk-flex
yarn start

# 4. 打开浏览器（预热）
# http://localhost:3000
```

### Pitch 时序

**[0-30s] 问题 + PPT**
- Web3 隐私困境

**[30s-1min] Terminal 演示**
- 切到 Terminal 2
- 指向 DemoSimple.s.sol 的输出：
  - "32 个地址"
  - "Bob 在第 15 个"
  - "隐私保护"

**[1min-1.5min] 前端演示**
- 切到浏览器
- 展示 Landing Page
- 点击进入 Bob 页面
- 展示 32 地址输入
- 点击进入 Alice 页面
- 展示验证界面

**[1.5min-2min] 总结 + PPT**
- 技术亮点
- 未来路线
- Call to Action

---

## ⚠️ 常见问题快速修复

### 问题 1: yarn deploy 失败（keystore）

**症状**：
```
Error: Keystore file does not exist
```

**解决**：
```bash
# 不使用 yarn deploy，直接用 forge
cd packages/foundry
forge script script/Deploy.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast
```

### 问题 2: 链未启动

**症状**：
```
Connection refused (os error 111)
```

**解决**：
```bash
# 确保 Terminal 1 运行着：
yarn chain

# 测试连接：
curl http://localhost:8545
```

### 问题 3: 端口被占用

**症状**：
```
Error: Address already in use
```

**解决**：
```bash
# 查找占用
lsof -i :8545
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题 4: 前端显示旧合约

**症状**：
- Bob/Alice 页面找不到合约

**解决**：
```bash
# 重新生成 deployedContracts.ts
cd ~/zk-flex
yarn contracts:build

# 或者重启前端
# Ctrl+C 停止
yarn start
```

---

## 📋 Pitch 前最后检查

```
5 分钟前：
  ✓ Terminal 1: yarn chain 正在运行
  ✓ Terminal 2: Demo 脚本已运行，Instance 地址已记录
  ✓ Terminal 3: yarn start 正在运行
  ✓ 浏览器：http://localhost:3000 已打开
  ✓ 笔记本：电源已连接
  ✓ 网络：不依赖互联网（全本地）

评委面前：
  ✓ Terminal 2 可见（Demo 输出）
  ✓ 浏览器可见（前端界面）
  ✓ PPT 准备好（备用）
```

---

## 🎯 核心命令汇总

### 最简单的启动方式

```bash
# 1. 启动链
yarn chain

# 2. 新终端：部署
cd packages/foundry && forge script script/DemoSimple.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545 --broadcast

# 3. 新终端：前端
yarn start
```

### 一行命令（如果需要）

```bash
# 部署（假设链已启动）
cd ~/zk-flex/packages/foundry && forge script script/DemoSimple.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545 --broadcast
```

---

## ✅ 确认工作正常

运行这个测试：

```bash
# 假设链在运行
cd ~/zk-flex/packages/foundry
forge script script/DemoSimple.s.sol \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545 \
  --broadcast

# 应该看到：
# [1/6] Deploying contracts...
# [2/6] Bob creates wallet pool instance...
# ...
# Instance: 0x...
```

**如果看到 Instance 地址，就成功了！** ✅

---

**这个清单确保你的 Demo 万无一失！** 🎉

