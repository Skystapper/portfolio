# PowerShell script to copy essential 3D icons from original portfolio
# Run this script from the portfolio-clean directory

$iconFiles = @(
    "bouncing-cube-animated-3d-icon-1317725137205.glb",
    "floating-cubes-loading-animated-3d-icon-514489560289.glb",
    "rotating-cube-loading-animated-3d-icon-323338265846.glb",
    "rubik-cube-loading-animated-3d-icon-918042144125.glb",
    "dropping-sphere-loading-animated-3d-icon-713943018271.glb",
    "spheres-abstract-shape-animated-3d-icon-1668763368472.glb",
    "twisted-circle-abstract-shape-animated-3d-icon-1057449839409.glb",
    "waving-plane-abstract-animated-3d-icon-772525492989.glb",
    "circle-abstract-shape-animated-3d-icon-89237357186.glb",
    "sphere-abstract-shape-animated-3d-icon-430778994990.glb",
    "cube-abstract-shape-animated-3d-icon-1284210180529.glb",
    "cube-abstract-shape-animated-3d-icon-1108000545873.glb",
    "circle-abstract-shape-animated-3d-icon-1692045000019.glb",
    "star-abstract-shape-animated-3d-icon-1042881958811.glb",
    "twisted-cubes-abstract-shape-animated-3d-icon-495212321593.glb"
)

$sourceDir = "..\public\icons"
$targetDir = "public\icons"

Write-Host "Copying essential 3D icons..." -ForegroundColor Green

$copied = 0
$missing = 0

foreach ($icon in $iconFiles) {
    $sourcePath = Join-Path $sourceDir $icon
    $targetPath = Join-Path $targetDir $icon
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item $sourcePath $targetPath -Force
            Write-Host "✓ Copied: $icon" -ForegroundColor Green
            $copied++
        }
        catch {
            Write-Host "✗ Failed to copy: $icon" -ForegroundColor Red
            Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "✗ Missing: $icon" -ForegroundColor Yellow
        $missing++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Copied: $copied files" -ForegroundColor Green
Write-Host "  Missing: $missing files" -ForegroundColor Yellow
Write-Host "`nNote: Missing files may be in subdirectories. Check the original project structure." -ForegroundColor Gray 