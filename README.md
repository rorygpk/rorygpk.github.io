# 🌐 Rory Secure Google Hub Space - 自托管与部署指南 (无谷歌云依赖)

本应用是一个全栈 Web 应用程序（基于 React 19 + Vite + Express + ESBuild），其核心组件（包括**极速安全谷歌检索、专属私密浏览器代理、对称加密数字密电传输中转站**）皆已实现**完全自给自足**，无需依赖任何 Google Cloud (谷歌云) 平台的产品、计算资源或付费 API。

您可以直接将本项目导出到 **GitHub**，并在本地电脑、私有服务器 (VPS，如阿里云、腾讯云、搬瓦工、DigitalOcean 等) 或 Docker 容器中快速跑起来。

---

## 📌 目录
1. [从 AI Studio 导出到 GitHub](#1-从-ai-studio-导出到-github)
2. [本地与私有服务器环境准备](#2-本地与私有服务器环境准备)
3. [项目安装与运行步骤](#3-项目安装与运行步骤)
4. [核心架构与零谷歌云运行原理](#4-核心架构与零谷歌云运行原理)
5. [生产服务器持续运行配置 (PM2)](#5-生产服务器持续运行配置-pm2)
6. [使用 Docker 进行一键容器化运行 (可选)](#6-使用-docker-进行一键容器化运行-可选)
7. [使用 Railway.app 进行一键云部署 (推荐)](#7-使用-railwayapp-进行一键云部署-推荐)
8. [双方案并行：Cloudflare 免费部署指南](#8-双方案并行cloudflare-免费部署指南)

---

## 1. 从 AI Studio 导出到 GitHub

1. 在 **Google AI Studio** 界面的右上角，点击 **Settings (设置)** 菜单或 **Export (导出)** 按钮。
2. 选择 **Export to GitHub (导出至 Github)**。
3. 绑定并授权您的 GitHub 账户，选择或创建您的 GitHub 仓库（可以是私有 Private 仓库以保障隐私）。
4. 点击 Confirm 完成同步，您的最新代码及其完整版本历史就会上传至您的 GitHub 仓库。

---

## 2. 本地与私有服务器环境准备

在您准备运行该程序的机器上（如您的个人电脑、VPS 服务器或本地虚拟机），仅需安装以下基础设施：

- **Node.js**: 推荐使用 **v18.0.0** 或以上版本（可前往 [nodejs.org](https://nodejs.org) 下载安装）。
- **npm**: 随 NPM 自动附带。

---

## 3. 项目安装与运行步骤

将项目克隆到本地，或从 GitHub 下载 ZIP 压缩包解开后：

### 第一步：在项目根目录打开终端 (Terminal)，安装项目依赖
```bash
npm install
```

### 第二步：配置本地环境变量 (Optional & Highly recommended)
在项目根目录创建一个名为 `.env` 的文件（用于本地配置）。由于由于您选择**不使用谷歌云**功能，不需要填任何 Google Client ID 或 Google Maps Key，直接保持空（或不创建）即可。本系统的安全检索和加密信息传输均能正常工作！

```ini
# .env 示例
PORT=3000
NODE_ENV=production
```

### 第三步：在本地运行开发模式 (Dev Mode)
如果您需要在本地调试、修改代码或体验热更新，运行：
```bash
npm run dev
```
之后在浏览器中打开 `http://localhost:3000` 即可启动并使用系统。

### 第四步：进行打包并编译为生产环境 (Recommended for Deployment)
当您准备将其作为长期稳定的系统发布或自用时，您应该使用以下命令编译项目：
```bash
# 1. 运行打包编译（这将同时打包前端静态文件，并通过 ESBuild 编译后端全栈 server.ts）
npm run build

# 2. 启动编译后的单文件高性能生产服务
npm run start
```
服务将在 `localhost:3000` 端口上独立、高速、稳定运行！

---

## 4. 核心架构与零谷歌云运行原理

本套系统为何能实现 **“不花一分钱，完全不依赖谷歌云，且能绕过阻截正常访问全球信息并保障安全”**？其底层机制如下：

1. **零数据库依赖：持久化本地 JSON 数据库 (`db.json`)**
   - 系统的后台不使用 Google Cloud Firestore、Spanner、或 SQL 数据库。
   - 所有在密信中转通道中存储的密文数据，皆保存在运行环境根目录下的 `db.json` 文件中。
   - 系统会自动在磁盘上读写此文件。如果您需要迁移系统，只需拷贝 `db.json` 文件即可，无需复杂的迁移配置。

2. **零 Search API 依赖：直接服务端免翻墙抓取代理**
   - 极速安全检索并不需要购买 Google Custom Search 的 API 凭证。
   - 后台 (`server.ts`) 直接通过安全的 SSL 专享代理通道去请求外网结构化 HTML，直接进行流提取、去噪和高抗阻解析（通过 DuckDuckGo 节点代理提供高质内容）。
   - 每一个搜索结果后面的 **🔓 极速代理安全打开 (Bypass Read)** 按键，是由后台直接发起到目标服务器的安全内容请求，只将干净的字符文本或 HTML 渲染回客户端。这在根本上实现了网页的免翻墙直接越境精细阅读！

3. **双向对称口令加盐加密 (完全离线本地加密)**
   - 您发送密电时输入的 **对称口令金钥** 不会被传输到服务器。
   - 系统利用客户端 JavaScript 进行首层口令加盐异或与 Base64 编码，使其在离开您的浏览器（或电脑）之前，就变成了一串无法破译的乱码字符。
   - 即使有人能偷看您的服务器磁盘 `db.json`，也无法知晓密文传输的具体内容。只有手握正确加盐口令的接收方，在网页上输入口令后，由浏览器直接在本地进行解码还原。

---

## 5. 生产服务器持续运行配置 (PM2)

如果您将项目运行在 VPS 远程服务器上，建议使用 **PM2** 进行后台守护，防止终端关闭进程挂掉或服务器重启后系统断连。

1. **在服务器上全局安装 PM2**
   ```bash
   npm install pm2 -g
   ```

2. **运行编译生成生产包**
   ```bash
   npm run build
   ```

3. **启动后台守护运行**
   ```bash
   pm2 start dist/server.cjs --name "rory-secure-hub"
   ```

4. **查看状态或重启命令**
   ```bash
   pm2 status
   # 重启
   pm2 restart rory-secure-hub
   # 查看实时运行日志
   pm2 logs rory-secure-hub
   ```

---

## 6. 使用 Docker 进行一键容器化运行 (可选)

项目根目录中已预置了标准的 `Dockerfile`，您可以极速通过 Docker 完成一键部署：

1. **构建您的专属 Docker 镜像**
   ```bash
   docker build -t rory-secure-hub .
   ```

2. **在后台常驻运行容器，并映射 3000 端口**
   ```bash
   docker run -d --name secure_hub_container -p 3000:3000 -v $(pwd)/db.json:/app/db.json --restart always rory-secure-hub
   ```
   *说明：`-v $(pwd)/db.json:/app/db.json` 参数将容器内的本地临时数据库映射挂载到您主机的磁盘中，这样容器即使重启、重建，您已保存的密电、设置也不会丢失。*

---

## 7. 使用 Railway.app 进行一键云部署 (推荐)

如果您没有自己的服务器，**Railway** 是一个非常优秀的自动化部署平台，可以直接从您的 GitHub 仓库一键拉取并部署。

> ⚠️ **重要提醒 (关于 Vercel vs Railway)**: 
> 因为本系统采用全栈 Express 模式 + 本地 `db.json` 持久化存储数据，而 Vercel 的函数环境是无状态 (Stateless) 且只读的，会导致您重启时丢失数据（如丢失密电）。**因此强烈推荐使用 Railway**，它提供完全的容器化环境，能完美兼容本地文件系统。

### Railway 极速部署步骤：

1. **导出到 GitHub**: 在 AI Studio 右上角，通过 `Settings -> Export to GitHub` 将当前代码导出到您的 GitHub 仓库。
2. **注册/登录 Railway**: 访问 [Railway.app](https://railway.app/) 并使用 GitHub 账号登录。
3. **新建项目**: 点击控制台右上角的 **"New Project"** -> 选择 **"Deploy from GitHub repo"**。
4. **选择您的仓库**: 选择您刚才导出的仓库名称（如 `ai-studio-rory-hub`）。
5. **添加持久化磁盘硬盘 (Volume) 防止数据丢失**:
   - 在弹出的应用卡片界面，点击进入您的服务设置。
   - 找到 **"Volumes"** 选项卡。
   - 点击 **"Add Volume"** 创建一块磁盘。
   - 在 Mount Path (挂载路径) 处填写: `/app/db.json` (对应于代码根目录即可)。这样每次 Railway 重启部署，您的密电和配置文件就不会丢失！
6. **自动构建与上线**: 
   - Railway 会自动识别代码中的 `package.json`，自动执行 `npm install` 与 `npm run build`。
   - 然后它为您自动生成了一个外网可以随地访问的 HTTPS 域名链接（在 Settings 的 **Domains** 部分可以查看或修改自定义域名）。

点击生成的链接，您的个人节点就已经在海外机房跑起来了，马上就可以在外网体验零谷歌云依赖的直连搜索啦！

---

## 8. 双方案并行：Cloudflare 免费部署指南

由于本系统拥有**极其安全的极速检索 Node.js 代理**和基于本地磁盘读写的高强度脱机环境（`db.json`），这使得基于 Serverless 纯粹无状态的 Cloudflare Pages 直接托管会出现后台函数兼容问题。为了彻底满足“零成本且利用 Cloudflare 高速 CDN / 盾防御”的需求，我们提供以下两条实施路线进行“双方案输出”：

### 方案 A（王者路线）：本地免费硬路由托管 + Cloudflare Tunnels（零成本内网穿透）

这是利用 Cloudflare 的**最完美方法**，不仅一分钱不花，还能拥有全球第一梯队的 CDN 加速与 WAF 防御，同时数据就在你自己的硬盘里，谁也拿不走。

1. **准备任意闲置电脑/树莓派/NAS**：
   在您家里或者办公室一台可以开机联网的设备上，安装和运行本项目（`npm run start`，暴露 `localhost:3000`）。
2. **连接 Cloudflare Tunnels (Zero Trust)**：
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，在左侧选择 **Zero Trust** -> **Networks** -> **Tunnels**。
   - 点击 **Add a tunnel**，选择 `cloudflared`，给你的通道起个名字。
   - Cloudflare 会给你一行命令行代码（支持 Windows/Mac/Linux），复制在你的内网机器上运行。
   - 配置公网路由，将你拥有的免费域名（比如 `hub.yourdomain.com`）指向本地的 `localhost:3000`。
3. **完成上线**：
   现在，该设备已经成为了全世界最坚不可摧的私有代理网关！外网用户只能通过 Cloudflare 边缘节点 HTTPS 加密访问，所有流量都被你的专机处理并且数据也留在这里。

### 方案 B（轻量路线）：部分阉割版强上 Cloudflare Pages

如果您连挂机的设备都没有，只想把代码扔到云端完全白嫖，我们依然可以借助前端打包将其托管在 Cloudflare 上（但请注意，出于无状态原因，您可能需要配合外接数据库实现全功能状态支持）：

1. **调整前端为完全纯静态输出**：在 `vite.config.ts` 中可能需要移除或 bypass API 端验证，仅靠纯前端运算。
2. **连接 Github 至 Cloudflare Pages**：在 Cloudflare 选择 **Pages** -> **Connect to Git** 并选中您的仓库。
3. **修改构建命令**：
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/client` 或纯前端打包产出目录。
4. *(进阶)* 为了支持后台的极速搜索与 `db.json` 私密加盐解密：您需要将 `server.ts` 中的 `app.post` 和 `app.get` 抽出，移植到 **Cloudflare Workers** 或利用 Cloudflare 的 **KV 数据库** 替代 `db.json` 来保存密电。这也是一项极具挑战和乐趣的全网开源改造计划！

---

## 9. 绝对零门槛云端白嫖方案 (全无脑手机操作版 / 0门槛)

对于手机操作不方便、讨厌绑定信用卡的您，我们专门针对 **Hugging Face Spaces (HF 空间)** 做了内嵌预设。它提供**完全免费且免绑卡**的坚固 Docker 算力空间，极其适合部署本加密网关。

### 📱 仅需手机点按 3 步，实现免维护上线：

1. **一键同步到 Github**: 在当前页面 (AI Studio) 右上角点击 `Settings` -> `Export to GitHub`，将代码传到您的名下。
2. **手机极速创建 HF 空间**: 打开 [Hugging Face Spaces 创建页](https://huggingface.co/new-space) (只需绑定个邮箱登录)。
3. **无脑全自动部署**:
   - 填写您自己喜欢的空间名字 (Space name)
   - **License**: 留空即可
   - **Select the Space SDK**: 👉 必须点选 **Docker** (Blank)
   - 在底下找到 **"Import an existing Space/Repo"** 👉 填入您刚才的 GitHub 仓库链接。
   - 猛击最下方的 **"Create Space"**。
   
🎉 **大功告成！** 连端口都不用配置，我们在底层代码里已经为你锁定了 HF 专属的 7860 端口（您不用做任何操作）。稍等几分钟平台自动构建完毕，您将彻底拥有一个终身免费、免被墙的 `xxxxxxxx.hf.space` 超强私密云端系统！

### 方案二：Glitch / Replit (点击即玩的全栈沙箱)
这类型平台为开发者提供彻底“免绑卡”的快捷体验：

- **[Glitch (glitch.com)](https://glitch.com/)**：登录后选择 **New Project -> Import from GitHub**，粘贴仓库链接。它会自动克隆代码，并运行 `package.json` 中的启动命令。直接分配给您一个 `xxx.glitch.me` 的海外绿标链接。
- **[Replit (replit.com)](https://replit.com/)**：同样的 Import from GitHub 流程，导入后点击顶部的绿色超级大按钮 **Run**。整个系统立刻拉起。即便隔天休眠，下次点击访问时只需等待几秒就会满血复活！您的 `db.json` 数据也会安稳地挂载在云环境的磁盘里。

---

祝您使用愉快！如有关于安全通道或自建部署的进一步技术探讨，欢迎随时进行指令下达。
