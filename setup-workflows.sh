#!/bin/bash

# GitHub Actions Workflows Setup Script
# This script will create the necessary workflow files in .github/workflows/

echo "🚀 Setting up GitHub Actions workflows..."

# Create .github/workflows directory
mkdir -p .github/workflows

# Copy workflow files
if [ -d "workflows-ready" ]; then
    echo "📁 Copying workflow files from workflows-ready/ to .github/workflows/"
    cp workflows-ready/*.yml .github/workflows/
    echo "✅ Workflow files copied successfully!"
else
    echo "❌ Error: workflows-ready directory not found!"
    exit 1
fi

# List created files
echo ""
echo "📋 Created workflow files:"
ls -la .github/workflows/

echo ""
echo "✨ Setup complete! Now you can:"
echo "1. Review the workflow files in .github/workflows/"
echo "2. Commit and push the changes:"
echo "   git add .github/workflows/"
echo "   git commit -m '🚀 Activate GitHub Actions workflows'"
echo "   git push origin master"
echo ""
echo "After pushing, your GitHub Actions will be active!"