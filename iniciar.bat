@echo off
cd /d "%~dp0"
echo.
echo  === Mision: Calidad ===
echo  Construyendo y arrancando la web con Docker...
echo.
set COMPOSE_BAKE=false
docker compose up -d --build
if errorlevel 1 (
  echo.
  echo  No se pudo arrancar. Asegurate de que Docker Desktop esta abierto.
  pause
  exit /b 1
)
echo.
echo  Listo! Abriendo http://localhost:8084
start http://localhost:8084
timeout /t 3 >nul
