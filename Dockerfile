# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json frontend/
COPY frontend/.npmrc frontend/
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Build stage for backend
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json backend/
COPY backend/.npmrc backend/
WORKDIR /app/backend
RUN npm ci

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package.json .
COPY .npmrc* .

# Copy backend
COPY backend/ backend/
COPY --from=backend-build /app/backend/node_modules backend/node_modules

# Copy frontend build
COPY --from=frontend-build /app/frontend/build frontend/build

# Create necessary directories
RUN mkdir -p backend/uploads/games

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "backend/server.js"]