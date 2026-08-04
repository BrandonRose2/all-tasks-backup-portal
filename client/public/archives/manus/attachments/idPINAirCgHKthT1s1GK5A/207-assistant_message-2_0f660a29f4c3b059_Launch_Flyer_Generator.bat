@echo off
title Referral Flyer Generator
echo.
echo  =============================================
echo   Apartment Corp - Referral Flyer Generator
echo  =============================================
echo.
echo  Starting local photo server...
echo  Opening app in browser...
echo.
echo  To STOP the server, close this window.
echo.

:: Change to the folder where this bat file lives
cd /d "%~dp0"

:: Kill any existing server on port 8765
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8765 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Wait briefly
timeout /t 1 /nobreak >nul

:: Try Python 3 first, then Python
where python >nul 2>&1
if %errorlevel% == 0 (
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:8765/app"
    python server.py
    goto :end
)

where python3 >nul 2>&1
if %errorlevel% == 0 (
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:8765/app"
    python3 server.py
    goto :end
)

:: Python not found
echo  ERROR: Python is not installed on this computer.
echo.
echo  Please install Python from https://www.python.org/downloads/
echo  Make sure to check "Add Python to PATH" during installation.
echo.
pause
:end
