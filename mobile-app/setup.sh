#!/bin/bash

# NeuroAI Mobile App - Quick Start Script
# This script helps you get started with the mobile app

echo "================================================"
echo "  NeuroAI Mobile App - Setup Script"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the mobile-app directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "================================================"
echo "  Next Steps:"
echo "================================================"
echo ""
echo "1. Start the development server:"
echo "   npm start"
echo ""
echo "2. On your mobile device:"
echo "   - Install 'Expo Go' from App Store or Play Store"
echo "   - Scan the QR code that appears"
echo ""
echo "3. On emulator:"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios (Mac only)"
echo ""
echo "================================================"
echo "  Important Configuration:"
echo "================================================"
echo ""
echo "⚠️  Before running, update these settings:"
echo ""
echo "1. API Configuration (src/constants/theme.js):"
echo "   - Update API_BASE_URL to your server address"
echo "   - Use your local IP instead of localhost"
echo "   - Example: http://192.168.1.100:5000"
echo ""
echo "2. Auth0 Configuration (src/constants/theme.js):"
echo "   - Verify AUTH0_CONFIG domain and clientId"
echo "   - Add redirect URI to Auth0 dashboard"
echo ""
echo "3. Assets:"
echo "   - Copy images from frontend/src/assets to mobile-app/src/assets"
echo "   - Or use the emoji placeholders already in place"
echo ""
echo "================================================"
echo "  Documentation:"
echo "================================================"
echo ""
echo "- Setup Guide: SETUP.md"
echo "- Project Structure: PROJECT_STRUCTURE.md"
echo "- Main README: README.md"
echo ""
echo "================================================"
echo "  Support:"
echo "================================================"
echo ""
echo "📧 Email: support@neuroai.com"
echo "📚 Expo Docs: https://docs.expo.dev"
echo ""
echo "Happy coding! 🚀"
echo ""
