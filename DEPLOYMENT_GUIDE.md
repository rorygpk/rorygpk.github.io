# Vercel Serverless Deployment Guide

本项目已配置为使用 Vercel 无服务器函数后端 + Vite 前端的组合。

## 部署步骤

### 1. 创建 Vercel 账户并连接 GitHub

1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 2. 导入项目

1. 在 Vercel 仪表板点击 "New Project"
2. 选择 `rorygpk/rorygpk.github.io` 仓库
3. Vercel 会自动检测配置（vercel.json）

### 3. 配置环境变量

在 Vercel 仪表板的 "Settings" → "Environment Variables" 中添加：

```
VITE_GEMINI_API_KEY = your_gemini_api_key_here
CURRENT_DOMAIN = fatshanpost.com
ADMIN_EMAIL = marvis_zhou@outlook.com
```

### 4. 配置自定义域名

1. 在 "Settings" → "Domains" 中添加 `rorygpk.online`
2. 更新你的域名 DNS 设置（如果不是 Vercel 托管的域名）
3. 等待 DNS 生效（通常 5-30 分钟）

### 5. 部署

点击 "Deploy" 按钮，或者：
- 任何 push 到 `main` 分支都会自动触发部署
- Vercel 会自动构建项目并部署到全球 CDN

## 项目结构

```
.
├── src/                      # React 前端代码
├── api/                      # 无服务器 API 函数
│   ├── config.ts            # GET /api/config
│   ├── auth/
│   │   └── me.ts            # GET /api/auth/me
│   └── admin/
│       └── change-domain.ts  # POST /api/admin/change-domain
├── dist/                     # 构建输出（自动生成）
├── vercel.json              # Vercel 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 项目依赖

```

## API 端点

### GET /api/config
获取系统配置

**响应：**
```json
{
  "currentDomain": "fatshanpost.com",
  "adminEmail": "marvis_zhou@outlook.com"
}
```

### GET /api/auth/me
获取当前用户信息

**响应：**
```json
{
  "user": {
    "id": "1",
    "email": "marvis_zhou@outlook.com",
    "role": "admin",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=marvis"
  }
}
```

### POST /api/admin/change-domain
修改全局域名

**请求体：**
```json
{
  "newDomain": "newdomain.com"
}
```

**响应：**
```json
{
  "success": true,
  "message": "Global domain updated to @newdomain.com",
  "currentDomain": "newdomain.com"
}
```

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 创建 `.env.local` 文件：
   ```bash
   cp .env.example .env.local
   ```

3. 填写你的环境变量（如 GEMINI_API_KEY）

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 打开 `http://localhost:5173` 查看应用

## 本地测试 API 函数

对于本地测试，你可以：

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 启动 Vercel 开发环境：
   ```bash
   vercel dev
   ```

3. API 端点将在 `http://localhost:3000/api/*` 可用

## 生产环境配置

- **前端**：自动部署到 Vercel CDN，支持全球加速
- **API 函数**：自动从 `api/` 目录部署为无服务器函数
- **自定义域名**：通过 Vercel 或自有 DNS 配置
- **HTTPS**：自动通过 Let's Encrypt 配置，无需额外操作

## 常见问题

### Q: API 函数在哪里执行？
A: API 函数在 Vercel 的无服务器计算平台上执行，无需管理服务器。

### Q: 域名变更是否持久化？
A: 当前实现是内存存储，重新部署会重置。如需持久化，请添加数据库（如 MongoDB）。

### Q: 如何增加新的 API 端点？
A: 在 `api/` 目录下创建新的 TypeScript 文件，遵循 `api/[path].ts` 的命名约定。

### Q: 环境变量如何访问？
A: 在前端代码中使用 `import.meta.env.VITE_*` 访问（需要 `VITE_` 前缀）。
在 API 函数中使用 `process.env.*` 访问。

## 支持

如有问题，可以：
- 查阅 [Vercel 文档](https://vercel.com/docs)
- 查阅 [Vite 文档](https://vitejs.dev)
- 提交 GitHub Issue
