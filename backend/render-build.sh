#!/bin/bash
set -e  # Exit on error

echo "🚀 Starting Render build for Vansh Enterprises Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install type definitions
echo "📦 Installing TypeScript type definitions..."
npm install --save-dev @types/node @types/express @types/mongoose @types/cors @types/bcryptjs @types/jsonwebtoken @types/morgan

# Build the app
echo "🏗️ Building TypeScript application..."
npm run build

echo "✅ Build completed successfully!"