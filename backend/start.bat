@echo off
echo 🎨 ELOUARATE ART - Professional Server Startup
echo ================================================

REM Kill any existing processes on port 3000
echo 🔄 Checking for existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo 🔪 Killing process %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM Wait a moment for cleanup
timeout /t 2 /nobreak >nul

REM Set environment variables
set NODE_ENV=development
set PORT=3000
set FRONTEND_URL=http://localhost:8080

REM Start the clean server
echo 🚀 Starting clean server...
echo.
node server-clean.js

pause 