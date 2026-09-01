#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# CartVerse Backend - Local Setup Script
# ═══════════════════════════════════════════════════════════════
# This script sets up the backend for local development with PostgreSQL
# Usage: bash setup-local.sh

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  CartVerse Backend - Local Development Setup           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ───────────────────────────────────────────────────────────────
# Check Prerequisites
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}✗ Node.js 20+ required (found v$NODE_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check Docker (for PostgreSQL)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker not found (needed for PostgreSQL container)${NC}"
    echo -e "${YELLOW}  Install Docker from https://docker.com${NC}"
fi

echo ""

# ───────────────────────────────────────────────────────────────
# Install Dependencies
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""

# ───────────────────────────────────────────────────────────────
# Setup Environment
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Setting up environment...${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template${NC}"
    cp .env.example .env || {
        echo -e "${RED}✗ Could not create .env file${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ .env created (fill in DATABASE_URL if using remote Supabase)${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo ""

# ───────────────────────────────────────────────────────────────
# Setup Database
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Setting up database...${NC}"

# Check if PostgreSQL is running
DB_URL=$(grep DATABASE_URL .env | cut -d'=' -f2 | tr -d '"')

if [[ $DB_URL == *"localhost"* ]]; then
    echo "Starting PostgreSQL container..."
    
    if command -v docker &> /dev/null; then
        # Check if container is already running
        if docker ps | grep -q cartverse-db; then
            echo -e "${GREEN}✓ PostgreSQL container already running${NC}"
        else
            # Start Docker Compose
            docker-compose up -d db
            echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
            sleep 5
            echo -e "${GREEN}✓ PostgreSQL container started${NC}"
        fi
    else
        echo -e "${RED}✗ Docker needed for local PostgreSQL${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Using remote database (Supabase)${NC}"
fi

echo ""

# ───────────────────────────────────────────────────────────────
# Generate Prisma Client
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Generating Prisma client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

echo ""

# ───────────────────────────────────────────────────────────────
# Run Migrations
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}Running database migrations...${NC}"
npx prisma db push
echo -e "${GREEN}✓ Database migrations completed${NC}"

echo ""

# ───────────────────────────────────────────────────────────────
# Seed Database
# ───────────────────────────────────────────────────────────────

read -p "Seed database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Seeding database...${NC}"
    node server/scripts/seed.js
    echo -e "${GREEN}✓ Database seeded${NC}"
fi

echo ""

# ───────────────────────────────────────────────────────────────
# Summary
# ───────────────────────────────────────────────────────────────

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Complete! ✓                                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo -e "  ${YELLOW}1. Start the backend server:${NC}"
echo -e "     ${GREEN}npm run dev:server${NC}"
echo ""
echo -e "  ${YELLOW}2. Test the API (in another terminal):${NC}"
echo -e "     ${GREEN}curl http://localhost:5000/api/health${NC}"
echo ""
echo -e "  ${YELLOW}3. Browse database (Prisma Studio):${NC}"
echo -e "     ${GREEN}npx prisma studio${NC}"
echo ""
echo -e "  ${YELLOW}4. Start frontend (in another terminal):${NC}"
echo -e "     ${GREEN}npm run dev${NC}"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "  • DEPLOYMENT_GUIDE.md - Deploy to production"
echo -e "  • SUPABASE_SETUP.md - Supabase configuration"
echo -e "  • ENVIRONMENT_VARIABLES.md - All environment variables"
echo ""
