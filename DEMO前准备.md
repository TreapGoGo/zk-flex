# Demo 前准备清单

## 🚀 Hackathon Pitch 前 10 分钟准备

### 方案 A：使用开发模式 + 预热（推荐，快速）

```bash
# === 5 分钟前开始 ===

# 1. 启动链
Terminal 1: cd ~/ethshanghai/zk-flex && yarn chain

# 2. 部署合约
Terminal 2:
cd ~/ethshanghai/zk-flex/packages/foundry
export BOB_REAL_ADDRESS=0x15AfABaA426334636008Bc15805760716E8b5c5E
export BOB_PROXY_ADDRESS=0xBA699556d41CD93e794952Bf1476ce9069b1EA03
export ALICE_ADDRESS=0x332772fce634D38cdfC649beE923AF52c9b6a2E5
forge script script/Deploy.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545 --broadcast
node scripts-js/generateTsAbis.js
forge script script/DemoSimple.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545 --broadcast

# 3. 启动前端
Terminal 3: cd ~/ethshanghai/zk-flex && yarn start

# === 等待前端启动后 ===

# 4. 预热所有页面（浏览器）
→ 访问 http://localhost:3000
   等待编译完成（看到页面显示）
   
→ 访问 http://localhost:3000/zk-flex/bob
   等待编译完成（看到页面显示）
   
→ 访问 http://localhost:3000/zk-flex/alice
   等待编译完成（看到页面显示）

# === Pitch 时 ===
所有页面已编译，访问速度 <1 秒 ✨
```

---

### 方案 B：使用生产模式（最快，需提前构建）

```bash
# === Pitch 前 1 天或当天早上 ===

# 1. 构建生产版本（一次性，2-3 分钟）
cd ~/ethshanghai/zk-flex/packages/nextjs
yarn build

# === Pitch 前 5 分钟 ===

# 2. 启动链
Terminal 1: cd ~/ethshanghai/zk-flex && yarn chain

# 3. 部署合约
Terminal 2: （同方案 A）

# 4. 启动生产服务器
Terminal 3: 
cd ~/ethshanghai/zk-flex/packages/nextjs
yarn start  # 会自动使用 build 的版本

# === Pitch 时 ===
所有页面秒开，无需预热！✨
```

**优势**：
- ✅ 所有页面已编译
- ✅ 访问速度极快（<1秒）
- ✅ 无需预热

**劣势**：
- ⏳ build 需要 2-3 分钟（提前做）
- ⏳ 修改代码需要重新 build

---

## 🎯 推荐

**方案 A（预热）** - 简单快速

Pitch 前 5 分钟：
1. 启动系统（2 分钟）
2. 预热 3 个页面（3 分钟）
3. 准备完成

---

## ✅ 检查清单

```
5 分钟前：
  ✓ Terminal 1: yarn chain
  ✓ Terminal 2: 合约已部署，Instance 地址已记录
  ✓ Terminal 3: yarn start
  ✓ 浏览器：3 个页面已预热，全部显示正常

评委面前：
  ✓ 所有页面秒开
  ✓ 流畅演示
```
