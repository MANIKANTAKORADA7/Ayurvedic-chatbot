@echo off
title Ayurvedic Home Remedy Chatbot Local Server
echo ==============================================================
echo       Ayurvedic Home Remedy Chatbot Local Server
echo ==============================================================
echo.
echo This script will spin up a local server on http://localhost:8000.
echo.

:: Check for Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Python is installed.
    echo Starting Python HTTP server on http://localhost:8000...
    echo.
    echo Press Ctrl+C in this window to stop the server.
    echo.
    start "" "http://localhost:8000"
    python -m http.server 8000
    goto end
)

:: Check for Node / npx
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Node.js/npx is installed.
    echo Starting local web server on http://localhost:8000...
    echo.
    echo Press Ctrl+C in this window to stop the server.
    echo.
    start "" "http://localhost:8000"
    npx -y http-server -p 8000
    goto end
)

echo.
echo ==============================================================
echo [WARNING] Neither Python nor Node.js was found in your PATH.
echo ==============================================================
echo.
echo To run this application:
echo.
echo 1. You can open 'index.html' directly in any modern web browser.
echo 2. If you prefer a local server, install Python or Node.js to enable automated local serving.
echo.
pause

:end
