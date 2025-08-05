#!/bin/bash

echo "🚀 Deploying 'After Cognition' thesis to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "_quarto.yml" ]; then
    echo "❌ Error: Not in a Quarto project directory. Please run from project root."
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes..."
    read -p "Enter commit message (or press Enter for default): " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update thesis content - $(date '+%Y-%m-%d %H:%M')"
    fi
    
    echo "Committing changes..."
    git add .
    git commit -m "$commit_message"
fi

# Push to remote repository
echo "📤 Pushing to GitHub..."
git push

# Render the site
echo "🔨 Rendering Quarto book..."
quarto render

# Deploy to GitHub Pages
echo "🌐 Publishing to GitHub Pages..."
quarto publish gh-pages --no-browser

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📖 Your thesis is now available at:"
    echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
    echo ""
    echo "💡 Share REVIEW_GUIDE.md with your supervisors for commenting instructions."
else
    echo "❌ Deployment failed. Check the output above for errors."
    exit 1
fi
