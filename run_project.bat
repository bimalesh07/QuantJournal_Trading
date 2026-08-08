@echo off
title TradeTrack PRO - One Click Local Starter
color 0A

echo =========================================================================
echo               📈 TradeTrack PRO - Analytics Engine Launcher
echo =========================================================================
echo.
echo [1/3] Starting Django Backend Server (Port 8000)...
start "TradeTrack PRO - Django Backend" cmd /k "cd backend && python manage.py runserver 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting React Vite Frontend Server (Port 3000)...
start "TradeTrack PRO - React Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Web Browser at http://localhost:3000/ ...
start http://localhost:3000/

echo.
echo =========================================================================
echo   SUCCESS! Backend and Frontend servers are active.
echo   Keep the server command windows open while using TradeTrack PRO.
echo =========================================================================
pause
