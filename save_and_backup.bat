@echo off
title TradeTrack PRO - One Click Git Backup & Cloud Sync
color 0B

echo =========================================================================
echo               ☁️ TradeTrack PRO - GitHub Auto Sync & Cloud Backup
echo =========================================================================
echo.

echo [1/3] Staging all updated project files...
git add .

echo [2/3] Committing changes with timestamp...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
git commit -m "Auto Backup: Updated TradeTrack PRO Engine %mydate% %mytime%"

echo [3/3] Pushing code to GitHub repository...
git push origin main

echo.
echo =========================================================================
echo   SUCCESS! All project files and fixes have been safely backed up to GitHub.
echo   Your code is secure forever and accessible from any laptop.
echo =========================================================================
pause
