#!/bin/bash
# scripts/setup.sh - Initial setup script for Quantum MACD Scanner

echo "=================================="
echo "Quantum MACD Scanner Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi
echo "✓ Node.js $NODE_VERSION found"

# Check npm
echo "Checking npm..."
NPM_VERSION=$(npm -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm $NPM_VERSION found"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your API keys:"
    echo "   - REACT_APP_BIRDEYE_API_KEY (Get from https://birdeye.so)"
    echo "   - REACT_APP_HELIUS_API_KEY (Optional, from https://helius.dev)"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Create necessary directories
echo ""
echo "Creating directories..."
mkdir -p data backtest-results ml-models
echo "✓ Directories created"

echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production build:"
echo "  npm run build"
echo ""

# Make script executable
chmod +x scripts/*.sh 2>/dev/null