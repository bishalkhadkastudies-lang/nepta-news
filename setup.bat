@echo off
echo Installing dependencies for NYTimes Clone...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not available. Please ensure Node.js is properly installed.
    pause
    exit /b 1
)

echo Node.js and npm are installed.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Copy .env.local.example to .env.local
echo 2. Fill in your Supabase credentials
echo 3. Run 'npm run dev' to start the development server
echo.
pause
