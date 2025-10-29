#!/usr/bin/env bash
# Exit on first error
set -o errexit

# Build the frontend
cd frontend
npm install
npm run build

# Go back to root and install backend deps
cd ../backend
npm install
