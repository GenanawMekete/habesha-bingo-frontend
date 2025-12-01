#!/bin/bash

# Telegram BINGO Frontend Deployment Script

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy based on platform
case $1 in
    "vercel")
        echo "🌐 Deploying to Vercel..."
        npx vercel --prod
        ;;
    "netlify")
        echo "🌐 Deploying to Netlify..."
        netlify deploy --prod
        ;;
    "github")
        echo "🐙 Deploying to GitHub Pages..."
        npm run deploy
        ;;
    "docker")
        echo "🐳 Building Docker image..."
        docker build -t telegram-bingo-frontend .
        echo "🚀 Running Docker container..."
        docker run -d -p 3001:3001 --name bingo-frontend telegram-bingo-frontend
        ;;
    *)
        echo "📁 Build output is in 'dist' folder"
        echo "You can deploy it to any static hosting service:"
        echo "  • Vercel: npx vercel --prod"
        echo "  • Netlify: netlify deploy --prod"
        echo "  • GitHub Pages: npm run deploy"
        echo "  • Docker: docker build -t telegram-bingo-frontend ."
        ;;
esac

echo "🎉 Deployment process completed!"
