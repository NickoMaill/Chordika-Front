[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:TERM = "xterm"

$Green = "`e[32m"
$Red = "`e[31m"
$Reset = "`e[0m"

$viteArgs = $args -join " "

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "[FORMAT] Running code formatter..." 
npm run format

Write-Host ""
Write-Host "[TYPECHECK] Running TypeScript type check..."
tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] TypeScript errors detected. Aborting." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] TypeScript check passed." -ForegroundColor Green

Write-Host ""
Write-Host "[LINT] Running ESLint..."
eslint .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] ESLint errors detected. Aborting." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] ESLint passed." -ForegroundColor Green

Write-Host ""
Write-Host "[START] Starting Vite server..." -ForegroundColor Magenta
vite --port 3000 $viteArgs