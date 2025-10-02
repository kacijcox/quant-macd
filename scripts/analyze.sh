#!/bin/bash
# scripts/analyze.sh

echo "=================================="
echo "Bundle Analysis"
echo "=================================="
echo ""

# Build with stats
npm run build -- --json > dist/stats.json

# Run webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/stats.json dist --mode static --report dist/report.html --open

echo ""
echo "Analysis complete!"
echo "Report saved to: dist/report.html"