#!/bin/bash
# scripts/deploy.sh

echo "=================================="
echo "Deploying Quantum MACD Scanner"
echo "=================================="
echo ""

# Build the project
echo "Building project..."
bash scripts/build.sh

if [ $? -ne 0 ]; then
    echo "Build failed. Aborting deployment."
    exit 1
fi

# Check deployment target
if [ -z "$DEPLOY_TARGET" ]; then
    echo "DEPLOY_TARGET not set. Options: vercel, netlify, aws"
    echo "Example: DEPLOY_TARGET=vercel ./scripts/deploy.sh"
    exit 1
fi

case "$DEPLOY_TARGET" in
    vercel)
        echo "Deploying to Vercel..."
        vercel --prod
        ;;
    netlify)
        echo "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        ;;
    aws)
        echo "Deploying to AWS S3..."
        if [ -z "$S3_BUCKET" ]; then
            echo "S3_BUCKET not set"
            exit 1
        fi
        aws s3 sync dist/ s3://$S3_BUCKET --delete
        ;;
    *)
        echo "Unknown deployment target: $DEPLOY_TARGET"
        exit 1
        ;;
esac

echo ""
echo "Deployment complete!"