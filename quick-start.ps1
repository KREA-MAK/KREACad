# KreaCAD React Quick Start Script (Windows)
# Run this script to set up the development environment

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          KreaCAD React - Quick Start Setup                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if Node.js is installed
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm -v
Write-Host "✅ npm found: $npmVersion`n" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed`n" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed`n" -ForegroundColor Green
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              🎉 Setup Complete!                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Choose what to do next:`n" -ForegroundColor White

Write-Host "  1️⃣  Development Server:     npm run react:dev" -ForegroundColor Cyan
Write-Host "  2️⃣  Production Build:       npm run react:build" -ForegroundColor Cyan
Write-Host "  3️⃣  Preview Build:          npm run react:preview" -ForegroundColor Cyan
Write-Host "  4️⃣  Serve Built App:        npm run react:serve" -ForegroundColor Cyan

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "  • CONVERSION_SUMMARY.md    - Overview of changes" -ForegroundColor White
Write-Host "  • REACT_SETUP_GUIDE.md     - Detailed setup guide" -ForegroundColor White
Write-Host "  • REACT_MIGRATION.md       - Architecture details" -ForegroundColor White

Write-Host "`n🚀 Recommended first step: npm run react:dev`n" -ForegroundColor Yellow
