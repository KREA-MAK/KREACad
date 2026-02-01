#!/bin/bash

# KreaCAD React Quick Start Script
# This script sets up and runs the React development environment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          KreaCAD React - Quick Start Setup                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"
echo ""

# Check npm
NPM_VERSION=$(npm -v)
echo "✅ npm found: $NPM_VERSION"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🎉 Setup Complete!                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Choose what to do next:"
echo ""
echo "  1️⃣  Development Server:     npm run react:dev"
echo "  2️⃣  Production Build:       npm run react:build"
echo "  3️⃣  Preview Build:          npm run react:preview"
echo "  4️⃣  Serve Built App:        npm run react:serve"
echo ""
echo "📚 Documentation:"
echo "  • CONVERSION_SUMMARY.md    - Overview of changes"
echo "  • REACT_SETUP_GUIDE.md     - Detailed setup guide"
echo "  • REACT_MIGRATION.md       - Architecture details"
echo ""
echo "🚀 Recommended first step: npm run react:dev"
echo ""
