# 使用官方的 Node.js 轻量级镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制其余源代码
COPY . .

# 构建前端和后端代码
RUN npm run build

# 暴露端口，注意云平台通常需要 3000 或 8080 等
EXPOSE 3000

# 启动服务
CMD ["npm", "run", "start"]
