#!/bin/bash

# Directory to search in (current directory by default)
directory="photo/${1:-.}"

# Path to wallpapers.html file (assuming it's in the same directory as the script)
wallpapers_file="wallpapers.html"

# Check if wallpapers.html exists
if [[ ! -f "$wallpapers_file" ]]; then
  echo "Error: wallpapers.html not found in $directory"
  exit 1
fi

# Iterate through all files in the given directory and subdirectories
find "$directory" -type f | while read file; do
  # Extract the filename from the full path
  filename=$(basename "$file")
  
  # Check if the filename is NOT mentioned in wallpapers.html
  if ! grep -q "$filename" "$wallpapers_file"; then
    echo "file '$filename' deleted"
    rm $file
  fi
done