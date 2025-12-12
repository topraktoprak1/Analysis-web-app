@echo off
echo ================================================
echo   Excel Data Analyzer - Installation Check
echo ================================================
echo.

echo Checking installation...
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python is installed
    python --version
) else (
    echo [FAIL] Python is NOT installed
    echo        Please install Python 3.8 or higher
)
echo.

REM Check app.py
if exist "app.py" (
    echo [OK] app.py found
) else (
    echo [FAIL] app.py NOT found
)

REM Check templates
if exist "templates" (
    echo [OK] templates folder found
    dir /b templates\*.html 2>nul | find /c /v "" > temp.txt
    set /p count=<temp.txt
    del temp.txt
    echo     Found HTML templates
) else (
    echo [FAIL] templates folder NOT found
)

REM Check static
if exist "static" (
    echo [OK] static folder found
) else (
    echo [FAIL] static folder NOT found
)

REM Check requirements.txt
if exist "requirements.txt" (
    echo [OK] requirements.txt found
) else (
    echo [FAIL] requirements.txt NOT found
)

echo.
echo ------------------------------------------------
echo Checking Python packages...
echo ------------------------------------------------
echo.

REM Check Flask
pip show Flask >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Flask is installed
) else (
    echo [MISSING] Flask - Run: pip install -r requirements.txt
)

REM Check pandas
pip show pandas >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] pandas is installed
) else (
    echo [MISSING] pandas - Run: pip install -r requirements.txt
)

REM Check plotly
pip show plotly >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] plotly is installed
) else (
    echo [MISSING] plotly - Run: pip install -r requirements.txt
)

echo.
echo ================================================
echo   Setup Check Complete
echo ================================================
echo.

if exist "app.py" if exist "templates" if exist "static" (
    echo Ready to start! Run:
    echo   start.bat
    echo.
    echo Or:
    echo   python app.py
    echo.
    echo Then open: http://localhost:5000
) else (
    echo Some files are missing. Please check the errors above.
)

echo.
pause
