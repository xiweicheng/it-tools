#!/bin/bash

# Build the project
npm run build

# Navigate to the dist directory
cd dist

# Initialize git
git init
git add .
git commit -m "deploy"

# Push to GitHub Pages
git push -f https://github.com/yourusername/it-tools.git master:gh-pages

# Navigate back to the project root
cd ..

echo "Deployed successfully!"