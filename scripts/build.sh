#!/bin/bash
set -e

echo "Starting build process..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm ci
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm ci --legacy-peer-deps
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build completed successfully!"