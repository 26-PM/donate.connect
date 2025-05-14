#!/bin/bash

# Clean up
rm -rf .next

# Set production environment
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean npm cache
npm cache clean --force

# Install dependencies with exact versions
npm ci

# Run the build using npx
npx next build
