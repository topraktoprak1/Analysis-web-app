@echo off
echo ================================================
echo   Excel Data Analyzer - Starting Application
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo Python found!
echo.

REM Check if requirements are installed
echo Checking dependencies...
pip show Flask >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies from requirements.txt...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)

echo.
echo ================================================
echo   Starting Flask Application
echo ================================================
echo.
echo Application will be available at:
echo   http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask application
python app.py

pause
