# Multi-stage build for production
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-build

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm run install-all

FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
COPY package.json ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create uploads directory
RUN mkdir -p backend/uploads/games

EXPOSE 5000

CMD ["npm", "start"]