# 前端集成指南

## 🚀 快速启动完整系统

### 3 个终端启动

```bash
# Terminal 1: 本地链
cd ~/zk-flex
yarn chain

# Terminal 2: 部署合约（等链启动后）
yarn deploy

# Terminal 3: 启动前端（等部署完成后）
yarn start
```

访问：http://localhost:3000

---

## 📁 前端页面结构

### 已完成

```
✅ app/page.tsx - Landing Page
   - 炫酷背景动画
   - Bob/Alice 入口链接
   - 技术栈展示

✅ app/zk-flex/bob/page.tsx - Bob 界面
   - 创建钱包池实例（32 地址输入）
   - 生成 ZK 证明（UI 框架完成，待集成 snarkjs）
   - 快照数据展示

✅ app/zk-flex/alice/page.tsx - Alice 界面
   - 上传 proof.json
   - 验证证明（UI 框架完成，待集成合约调用）
   - 显示验证结果
```

### 待集成

```
⏳ snarkjs 证明生成
⏳ 合约验证调用
⏳ Web Worker 优化
⏳ 进度条显示
```

---

## 🔌 合约集成状态

### 当前状态

**deployedContracts.ts**：
- ✅ 已有 Scaffold-ETH 自动生成机制
- ⚠️ 需要先部署 WealthProofRegistry
- ⚠️ 运行 `yarn deploy` 会自动更新

### 部署流程

```bash
# 1. 启动本地链
yarn chain

# 2. 部署合约
yarn deploy
# 这会运行 packages/foundry/script/Deploy.s.sol
# 自动部署 WealthProofRegistry
# 自动生成 deployedContracts.ts

# 3. 查看生成的合约地址
cat packages/nextjs/contracts/deployedContracts.ts
```

### 使用合约

```typescript
// Bob 页面示例
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const { writeContractAsync: createInstance } = useScaffoldWriteContract("WealthProofRegistry");

await createInstance({
  functionName: "createProofInstance",
  args: [addresses], // address[32]
});
```

```typescript
// Alice 页面示例
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const { data: snapshot } = useScaffoldReadContract({
  contractName: "WealthProofInstance",
  address: instanceAddress,
  functionName: "getLatestSnapshot",
});
```

---

## 📦 snarkjs 集成计划

### 安装依赖

```bash
cd packages/nextjs
yarn add snarkjs
```

### 电路文件位置

```
packages/nextjs/public/circuits/
├── wealth_proof.wasm (12MB)
└── wealth_proof_final.zkey (919MB)
```

**注意**：这些文件已在 `.gitignore` 中排除。
- Demo 时从 localhost 加载（极快）
- 生产时需上传到 CDN

### 证明生成示例代码

```typescript
// Bob 页面
import * as snarkjs from "snarkjs";

async function generateProof() {
  // 1. MetaMask 签名
  const message = "ZK Flex Proof";
  const signature = await signMessage({ message });
  
  // 2. 准备 witness
  const witness = {
    // 私有输入
    r: splitSignature(signature.r),
    s: splitSignature(signature.s),
    pubkey: derivePubkey(signature),
    walletIndex: 15,
    
    // 公开输入
    msghash: hashMessage(message),
    addresses: addresses,
    balances: balances,
    threshold: parseEther(threshold)
  };
  
  // 3. 生成证明（30-60秒）
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    witness,
    "/circuits/wealth_proof.wasm",
    "/circuits/wealth_proof_final.zkey"
  );
  
  // 4. 下载
  downloadJSON({ proof, publicSignals }, "proof.json");
}
```

### 证明验证示例代码

```typescript
// Alice 页面
async function verifyProof(proofData: any) {
  // 调用合约 view 函数（免费）
  const result = await readContract({
    address: instanceAddress,
    abi: WealthProofInstanceABI,
    functionName: "verifyProof",
    args: [
      serializeProof(proofData.proof),
      parseEther(threshold)
    ]
  });
  
  return result; // true/false
}
```

---

## 🎨 UI/UX 优化建议

### Bob 页面

**创建实例**：
- ✅ 使用 AddressInput 组件（已集成）
- ✅ "Fill Test Addresses" 按钮（已实现）
- ✅ 32 个地址网格布局（已实现）
- ⏳ Loading 状态（交易确认时）

**生成证明**：
- ✅ 参数输入（walletIndex, threshold）
- ⏳ 进度条（0% -> 100%）
- ⏳ 阶段提示：
  - "Signing with MetaMask..."
  - "Loading circuit files... 50%"
  - "Generating proof... 75%"
  - "Complete!"

### Alice 页面

**上传证明**：
- ✅ 文件上传组件（已实现）
- ✅ Instance 地址输入（已实现）
- ⏳ 验证按钮（需集成合约）

**显示结果**：
- ✅ 结果卡片（success/error）
- ✅ "What you know" / "What you don't know"
- ⏳ 实际调用合约验证

---

## 🧪 测试流程

### 完整端到端测试

```bash
# 1. 启动系统
Terminal 1: yarn chain
Terminal 2: yarn deploy  
Terminal 3: yarn start

# 2. 测试 Bob 流程
- 访问 http://localhost:3000
- 点击 "Create Pool"
- 填写 32 个地址（或点击 "Fill Test Addresses"）
- 点击 "Create Instance"
- 等待交易确认
- 记下 Instance 地址

# 3. 测试 Alice 流程
- 点击 "Verify Proof"
- 输入 Instance 地址
- 上传 proof.json（如果有）
- 点击 "Verify"
- 查看结果
```

---

## ⚠️ 当前限制

### 证明生成部分

```
Status: UI 框架完成，功能未实现

原因：
- snarkjs 集成需要处理复杂的数据格式
- 签名需要拆分成 limbs（4 x 64-bit）
- 公钥推导需要额外的加密库
- 约 200-300 行代码

建议：
- Hackathon 可以先展示 UI
- 或者提供预生成的 proof.json 供测试
```

### 证明验证部分

```
Status: UI 完成，合约调用待实现

需要：
- 解析 proof.json 格式
- 序列化为合约参数
- 调用 instance.verifyProof()
- 约 50-100 行代码

优先级：高（相对简单）
```

---

## 📋 下一步任务清单

### 立即可做（15 分钟）

- [ ] 部署合约：`yarn deploy`
- [ ] 测试 Bob 页面路由：访问 `/zk-flex/bob`
- [ ] 测试 Alice 页面路由：访问 `/zk-flex/alice`
- [ ] 检查 UI 显示是否正常

### 短期任务（1-2 小时）

- [ ] 实现 Alice 页面的证明验证调用
- [ ] 添加 Loading 状态
- [ ] 错误处理

### 中期任务（3-5 小时）

- [ ] 集成 snarkjs
- [ ] 实现证明生成
- [ ] Web Worker 优化
- [ ] 进度条

---

**准备好了吗？现在可以启动系统测试！** 🚀

使用命令：
```bash
yarn chain  # Terminal 1
yarn deploy # Terminal 2（等链启动）
yarn start  # Terminal 3（等部署完成）
```

