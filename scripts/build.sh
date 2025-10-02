#!/bin/bash
# scripts/build.sh

echo "=================================="
echo "Building Quantum MACD Scanner"
echo "=================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist/

# Build for production
echo "Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "Build Successful!"
    echo "=================================="
    echo ""
    echo "Output directory: ./dist"
    echo "Bundle size:"
    du -sh dist/
    echo ""
else
    echo "Build failed!"
    exit 1
fi