# Multi-stage build for production
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
# Copy all frontend files first
COPY frontend/ ./
# Install dependencies
RUN npm ci --legacy-peer-deps
# Build the frontend with increased memory
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build

FROM node:20-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/.npmrc* ./
RUN npm ci

FROM node:20-alpine

WORKDIR /app

# Install production dependencies at root level for npm start command
COPY package*.json ./
COPY .npmrc* ./

# Copy backend with node_modules
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create uploads directory
RUN mkdir -p backend/uploads/games

# Set environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]