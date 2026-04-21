#!/bin/bash

# grAIn Expo Setup Script
# Installs all dependencies and configures the Expo project

set -e

echo "🌾 grAIn Expo Setup"
echo "=================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Expo-specific packages
echo "📦 Installing Expo packages..."
npx expo install axios expo-secure-store expo-router react-native-safe-area-context react-native-screens @react-navigation/native @react-navigation/native-stack

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Edit .env.local and set EXPO_PUBLIC_API_URL to your backend"
echo "2. Run 'npm start' to start the development server"
echo "3. Scan the QR code with Expo Go app or press 'i'/'a' for simulators"
echo ""
