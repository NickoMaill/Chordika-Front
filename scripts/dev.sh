#!/bin/sh

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Read CLI args
VITE_ARGS="$@"

echo ""
echo "🔍 ${GREEN}Formatting code...${NC}"
npm run format

echo ""
echo "🧪 ${GREEN}Running TypeScript type check...${NC}"
if ! tsc --noEmit; then
  echo "${RED}❌ TypeScript errors detected. Aborting.${NC}"
  exit 1
else
  echo "${GREEN}✅ TypeScript check passed.${NC}"
fi

echo ""
echo "🧹 ${GREEN}Running ESLint...${NC}"
if ! eslint .; then
  echo "${RED}❌ ESLint errors detected. Aborting.${NC}"
  exit 1
else
  echo "${GREEN}✅ ESLint passed.${NC}"
fi

echo ""
echo "🚀 ${GREEN}Starting Vite server...${NC}"
vite --port 3000 $VITE_ARGS