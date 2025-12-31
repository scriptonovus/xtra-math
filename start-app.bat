@echo off
echo Starting Scripto Projects...
echo.
echo This will start the file browser in your default browser
echo Make sure you have files in the "files" folder
echo.
cd /d "%~dp0"
start http://localhost:3000
npm start
pause
