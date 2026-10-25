@echo off
cd /d "%~dp0"
docker compose down
echo  Web detenida.
timeout /t 3 >nul
