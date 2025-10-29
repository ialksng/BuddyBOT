#!/usr/bin/env bash
set -o errexit  # Exit on first error

echo "📦 Installing and building frontend..."
cd frontend
npm install
npm run build

echo "📦 Installing backend dependencies..."
cd ../backend
npm install

echo "✅ Build completed successfully!"
