#!/bin/bash

# Check if exiftool is installed
if ! command -v exiftool &> /dev/null; then
    echo "Error: exiftool is not installed"
    exit 1
fi

# Check if directory is provided
if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/directory"
    exit 1
fi

# Verify directory exists
if [ ! -d "$1" ]; then
    echo "Error: Directory '$1' does not exist"
    exit 1
fi

# Find and process all JPG/JPEG/PNG files
find "$1" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.JPEG" -o -iname "*.PNG" -o -iname "*.JPG" \) -print0 | while IFS= read -r -d $'\0' file; do
    echo "Processing: $file"
    exiftool -all= -overwrite_original "$file"
done

echo "Done"