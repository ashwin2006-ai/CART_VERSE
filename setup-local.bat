@echo off
REM ═══════════════════════════════════════════════════════════════
REM CartVerse Backend - Local Setup Script (Windows)
REM ═══════════════════════════════════════════════════════════════
REM This script sets up the backend for local development with PostgreSQL
REM Usage: setup-local.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  CartVerse Backend - Local Development Setup           ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM ───────────────────────────────────────────────────────────────
REM Check Prerequisites
REM ───────────────────────────────────────────────────────────────

echo Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ✗ Node.js not found. Please install Node.js 20+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ✗ npm not found
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION%

echo.

REM ───────────────────────────────────────────────────────────────
REM Install Dependencies
REM ───────────────────────────────────────────────────────────────

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Failed to install dependencies
    exit /b 1
)
echo ✓ Dependencies installed

echo.

REM ───────────────────────────────────────────────────────────────
REM Setup Environment
REM ───────────────────────────────────────────────────────────────

echo Setting up environment...

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env >nul
    if errorlevel 1 (
        echo ✗ Could not create .env file
        exit /b 1
    )
    echo ✓ .env created
) else (
    echo ✓ .env already exists
)

echo.

REM ───────────────────────────────────────────────────────────────
REM Generate Prisma Client
REM ───────────────────────────────────────────────────────────────

echo Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ✗ Failed to generate Prisma client
    exit /b 1
)
echo ✓ Prisma client generated

echo.

REM ───────────────────────────────────────────────────────────────
REM Run Migrations
REM ───────────────────────────────────────────────────────────────

echo Running database migrations...
call npx prisma db push
if errorlevel 1 (
    echo ✗ Failed to run migrations
    exit /b 1
)
echo ✓ Database migrations completed

echo.

REM ───────────────────────────────────────────────────────────────
REM Seed Database
REM ───────────────────────────────────────────────────────────────

set /p SEED="Seed database with sample data? (y/n) "
if /i "%SEED%"=="y" (
    echo Seeding database...
    call node server/scripts/seed.js
    if errorlevel 1 (
        echo ✗ Failed to seed database
        exit /b 1
    )
    echo ✓ Database seeded
)

echo.

REM ───────────────────────────────────────────────────────────────
REM Summary
REM ───────────────────────────────────────────────────────────────

echo ╔════════════════════════════════════════════════════════╗
echo ║  Setup Complete! ✓                                    ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo  1. Start the backend server:
echo     npm run dev:server
echo.
echo  2. Test the API (in another terminal):
echo     curl http://localhost:5000/api/health
echo.
echo  3. Browse database (Prisma Studio):
echo     npx prisma studio
echo.
echo  4. Start frontend (in another terminal):
echo     npm run dev
echo.
echo Documentation:
echo  • DEPLOYMENT_GUIDE.md - Deploy to production
echo  • SUPABASE_SETUP.md - Supabase configuration
echo  • ENVIRONMENT_VARIABLES.md - All environment variables
echo.

endlocal
