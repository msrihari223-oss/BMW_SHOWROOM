@echo off
title BMW Showroom - Launcher
echo ========================================================
echo Launching BMW Luxury Showroom Web Application...
echo Frontend: React.js | Backend: Python FastAPI | DB: MongoDB Atlas
echo ========================================================

start "BMW Backend (FastAPI)" cmd /c "%~dp0start_backend.bat"
timeout /t 3 /nobreak >nul
start "BMW Frontend (React)" cmd /c "%~dp0start_frontend.bat"

echo.
echo Both servers have been launched!
echo Access the showroom in your browser at: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
echo.
pause

