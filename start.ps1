# Excel Data Analyzer - Startup Script
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Excel Data Analyzer - Starting Application" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if requirements are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow

try {
    $flaskInstalled = pip show Flask 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Flask not installed"
    }
    Write-Host "Dependencies already installed." -ForegroundColor Green
} catch {
    Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Starting Flask Application" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application will be available at:" -ForegroundColor Green
Write-Host "  http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the Flask application
python app.py
