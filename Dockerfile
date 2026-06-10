# 使用官方的 Node.js 轻量级镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（确保开发依赖如 Vite, esbuild 也被安装用于构建流程）
RUN npm install --include=dev

# 复制其余源代码
COPY . .

# 构建前端和后端代码
RUN npm run build

# 设置为生产环境运行
ENV NODE_ENV=production
ENV PORT=3000

# 暴露微服务容器端口
EXPOSE 3000

# 启动服务
CMD ["node", "dist/server.cjs"]
