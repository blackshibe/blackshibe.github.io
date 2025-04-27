<#
.SYNOPSIS
    Creates low-quality JPEG thumbnails for all JPG images in a directory and its subdirectories
.DESCRIPTION
    Scans 'page\photo' and all subdirectories, creating preview thumbnails for each JPG/JPEG image
    using Windows built-in tools (no additional software required)
    Preserves original file extension case (.JPG gets .preview.JPG, .jpg gets .preview.jpg)
#>

# Configuration
$SourceDir = "photo"
$ThumbnailSuffix = ".preview"
$MaxWidth = 4000
$MaxHeight = 4000
$Quality = 20  # 1-100 where lower is worse quality

# Initialize counters
$processed = 0
$skipped = 0
$errors = 0

# Check if source directory exists
if (-not (Test-Path -Path $SourceDir -PathType Container)) {
    Write-Host "ERROR: Source directory not found: $SourceDir" -ForegroundColor Red
    exit 1
}

# Get all JPG/JPEG files recursively
$images = Get-ChildItem -Path $SourceDir -Recurse -Include *.jpg,*.jpeg,*.JPG,*.JPEG

Write-Host "Starting thumbnail generation in: $SourceDir"
Write-Host "Found $($images.Count) images to process"
Write-Host "--------------------------------------------"

# Load required .NET assemblies
Add-Type -AssemblyName System.Drawing
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
    Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter (
    [System.Drawing.Imaging.Encoder]::Quality, $Quality
)

foreach ($img in $images) {
    # Skip files that are already thumbnails
    if ($img.Name -like "*$ThumbnailSuffix*") {
        continue
    }

    # Get the original extension in its exact case
    $originalExtension = $img.Extension
    
    # Set thumbnail path with matching case
    $thumbPath = Join-Path $img.DirectoryName ($img.BaseName + $ThumbnailSuffix + $originalExtension.ToLower())

    # For .JPG/.JPEG (uppercase) files, use uppercase extension
    if ($originalExtension -eq ".JPG" -or $originalExtension -eq ".JPEG") {
        $thumbPath = Join-Path $img.DirectoryName ($img.BaseName + $ThumbnailSuffix + $originalExtension)
    }

    # Skip if thumbnail already exists
    if (Test-Path -Path $thumbPath -PathType Leaf) {
        Write-Host "SKIPPED: $($img.FullName) (thumbnail exists)" -ForegroundColor Yellow
        Remove-Item -Path $thumbPath -Force
        continue
    }

    # Create thumbnail using Windows built-in tools
    try {
        Write-Host "PROCESSING: $($img.FullName)" -ForegroundColor Cyan
        
        $sourceImage = [System.Drawing.Image]::FromFile($img.FullName)
        
        # Calculate new dimensions maintaining aspect ratio
        $ratio = [Math]::Min($MaxWidth / $sourceImage.Width, $MaxHeight / $sourceImage.Height)
        $newWidth = [int]($sourceImage.Width * $ratio)
        $newHeight = [int]($sourceImage.Height * $ratio)
        
        # Create thumbnail bitmap
        $thumb = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($thumb)
        $graphics.DrawImage($sourceImage, 0, 0, $newWidth, $newHeight)
        
        # Save as JPEG with quality setting and correct extension case
        $thumb.Save($thumbPath, $jpegCodec, $encoderParams)
        
        # Clean up resources
        $sourceImage.Dispose()
        $graphics.Dispose()
        $thumb.Dispose()
        
        $processed++
        Write-Host "CREATED: $thumbPath" -ForegroundColor Green
    }
    catch {
        $errors++
        Write-Host "ERROR processing $($img.FullName): $_" -ForegroundColor Red
    }
}

# Summary
Write-Host "--------------------------------------------"
Write-Host "SUMMARY:"
Write-Host "  Total images:    $($images.Count)"
Write-Host "  Processed:       $processed" -ForegroundColor Green
Write-Host "  Skipped:         $skipped" -ForegroundColor Yellow
Write-Host "  Errors:          $errors" -ForegroundColor Red
Write-Host "Operation completed"