# Quick Setup Test Script
Write-Host "Testing Flask Application Setup..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Python Installation
Write-Host "1. Testing Python..." -NoNewline
try {
    $python = python --version 2>&1
    Write-Host " OK - $python" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "   Python is not installed or not in PATH" -ForegroundColor Yellow
}

# Test 2: Check if app.py exists
Write-Host "2. Checking app.py..." -NoNewline
if (Test-Path "app.py") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " FAILED - app.py not found" -ForegroundColor Red
}

# Test 3: Check if requirements.txt exists
Write-Host "3. Checking requirements.txt..." -NoNewline
if (Test-Path "requirements.txt") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " FAILED - requirements.txt not found" -ForegroundColor Red
}

# Test 4: Check templates folder
Write-Host "4. Checking templates folder..." -NoNewline
if (Test-Path "templates") {
    $templates = Get-ChildItem "templates" -Filter "*.html"
    Write-Host " OK - Found $($templates.Count) HTML files" -ForegroundColor Green
} else {
    Write-Host " FAILED - templates folder not found" -ForegroundColor Red
}

# Test 5: Check static folder
Write-Host "5. Checking static folder..." -NoNewline
if (Test-Path "static") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " FAILED - static folder not found" -ForegroundColor Red
}

# Test 6: Check Flask installation
Write-Host "6. Checking Flask installation..." -NoNewline
try {
    $flask = pip show Flask 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " Not installed" -ForegroundColor Yellow
        Write-Host "   Run: pip install -r requirements.txt" -ForegroundColor Cyan
    }
} catch {
    Write-Host " Not installed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup test complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Green
Write-Host "  .\start.ps1" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
