#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

VITE_ARGS="$@"

echo ""
echo "🧪 ${GREEN}Running TypeScript type check...${NC}"
if ! node --max-old-space-size=4096 ./node_modules/typescript/bin/tsc --noEmit; then
  echo "${RED}❌ TypeScript errors detected. Aborting.${NC}"
  exit 1
fi

echo ""
echo "🧹 ${GREEN}Running ESLint...${NC}"
if ! node --max-old-space-size=4096 ./node_modules/eslint/bin/eslint.js src --cache; then
  echo "${RED}❌ ESLint errors detected. Aborting.${NC}"
  exit 1
fi

echo ""
echo "🚀 ${GREEN}Starting Vite server...${NC}"
vite --port 3000 $VITE_ARGS