#!/bin/bash

echo "🎯 Preparing Kube Credential Assignment Submission..."

# Create submission directory
mkdir -p submission
cd submission

# Copy all necessary files
echo "📁 Copying project files..."
cp -r ../backend .
cp -r ../frontend .
cp -r ../k8s .
cp -r ../scripts .
cp ../docker-compose.yml .
cp ../package.json .
cp ../README.md .
cp ../SUBMISSION_READY.md .
cp ../*.md .

# Remove node_modules and build artifacts
echo "🧹 Cleaning up build artifacts..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.log" -type f -delete 2>/dev/null || true

# Create zip file
echo "📦 Creating submission zip..."
cd ..
zip -r kube-credential-submission.zip submission/ -x "*.DS_Store" "*.git*"

echo "✅ Submission ready!"
echo ""
echo "📧 Next steps:"
echo "1. Upload 'kube-credential-submission.zip' to Google Drive"
echo "2. Set sharing to 'Anyone with the link can view'"
echo "3. Email the Google Drive link to: hrfs@zupple.technology"
echo "4. Include live URL: https://kube-credential-x4n0.onrender.com"
echo ""
echo "🎉 Assignment complete! Good luck!"