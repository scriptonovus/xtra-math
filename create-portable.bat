@echo off
echo Creating portable Scripto Projects...
echo.
echo This will create a zip file with everything needed
echo.
cd /d "%~dp0"
powershell -Command "Compress-Archive -Path * -DestinationPath 'Scripto-Projects-Portable.zip' -Force"
echo.
echo Portable version created: Scripto-Projects-Portable.zip
echo.
echo To use: 
echo 1. Unzip the file
echo 2. Double-click start-app.bat
echo 3. Add your files to the "files" folder
echo.
pause
