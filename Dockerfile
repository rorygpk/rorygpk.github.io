FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the Vite React frontend and Express backend bundle
RUN npm run build

# Set Hugging Face Spaces default port explicitly to avoid configuration steps
ENV PORT=7860
EXPOSE 7860

# Start the application
CMD ["npm", "run", "start"]
