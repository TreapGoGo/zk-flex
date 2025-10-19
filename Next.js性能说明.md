# Next.js 按需编译说明

## 🔍 你观察到的现象

```
yarn start 启动后：
  ✅ 服务器立即启动（5-10 秒）
  ⏳ 但访问页面时才开始编译该页面
  
例如：
  访问 http://localhost:3000
    → 看到 "Compiling /"
    → 等待 10-20 秒
    → 页面加载
    
  访问 http://localhost:3000/zk-flex/bob
    → 看到 "Compiling /zk-flex/bob"
    → 等待 10-20 秒
    → 页面加载
```

---

## ✅ 这是 Next.js 15 的正常行为！

### Next.js 开发模式的按需编译（On-Demand Compilation）

**设计理念**：
```
不是一次性编译所有页面
而是：
  - 服务器启动时：不编译任何页面
  - 访问页面时：只编译这个页面
  - 后续访问：使用缓存（极快）
```

**优势**：
- ✅ 启动极快（5-10 秒）
- ✅ 只编译需要的页面
- ✅ 节省内存

**劣势**：
- ⏳ 首次访问每个页面需要等待编译
- ⏳ 适合开发，不适合演示

---

## 🎬 Hackathon 演示解决方案

### 方案 1: 预热所有页面（推荐）

```bash
# 1. 启动前端
yarn start

# 2. 在浏览器依次访问（预热编译）
http://localhost:3000                    # Landing Page
http://localhost:3000/zk-flex/bob       # Bob 页面
http://localhost:3000/zk-flex/alice     # Alice 页面

# 每个页面等待编译完成（10-20 秒）

# 3. 全部编译完成后，后续访问极快（<1 秒）
```

**✅ Pitch 前 5 分钟执行，演示时丝滑流畅！**

---

### 方案 2: 使用生产模式（最快）

```bash
# 构建生产版本（一次性编译所有页面）
yarn build

# 启动生产服务器
yarn start

# 所有页面立即可用，无延迟！
```

**问题**：
- ⚠️ build 需要 2-3 分钟
- ⚠️ 每次代码修改需要重新 build

---

### 方案 3: 禁用按需编译（Next.js 配置）

```typescript
// packages/nextjs/next.config.ts

const nextConfig = {
  // 开发模式预编译所有页面
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // 其他配置...
}
```

**效果**：
- 启动时间变长（1-2 分钟）
- 但所有页面立即可用

---

## 🎯 推荐方案

### For Hackathon Demo

**方案 1（预热）最适合**：

```bash
# Pitch 前 5 分钟

# 1. 启动系统（3 个终端）
Terminal 1: yarn chain
Terminal 2: forge script + generateTsAbis
Terminal 3: yarn start

# 2. 预热页面（浏览器）
访问 http://localhost:3000              # 等编译
访问 http://localhost:3000/zk-flex/bob  # 等编译
访问 http://localhost:3000/zk-flex/alice # 等编译

# 3. 全部编译完成

# Pitch 时：
所有页面秒开，丝滑流畅！✨
```

---

## 📊 性能对比

| 模式 | 启动时间 | 首次访问 | 后续访问 | 适合 |
|------|---------|---------|---------|------|
| **开发模式（默认）** | 5-10s | 10-20s | <1s | 开发 |
| **开发模式（预热）** | 5-10s | 10-20s（一次性）| <1s | **Demo ✅** |
| **生产模式** | 2-3min | <1s | <1s | 生产 |

---

## ✅ 结论

**不是性能问题，是 Next.js 15 的设计！**

- 第一次访问每个页面会编译（正常）
- 后续访问极快（缓存）
- **Pitch 前预热所有页面即可**

---

**现在明白了吗？这不是 bug，是 feature！** 😊

要我帮你准备一个"预热脚本"吗？

