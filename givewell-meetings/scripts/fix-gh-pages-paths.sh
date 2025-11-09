#!/bin/bash
#
# Fix paths for GitHub Pages deployment
# This script updates all absolute paths to include the base path for project sites
#

BASE_PATH="/givewell-board-meetings"
DIST_DIR="dist"

echo "Fixing paths for GitHub Pages deployment..."
echo "Base path: $BASE_PATH"

# Fix HTML files
find "$DIST_DIR" -name "*.html" -type f | while read file; do
  echo "Processing $file..."

  # Fix script src paths
  sed -i "s|src=\"/_expo/|src=\"$BASE_PATH/_expo/|g" "$file"

  # Fix href paths for navigation (but not external links or mailto/tel)
  sed -i "s|href=\"/player\"|href=\"$BASE_PATH/player\"|g" "$file"
  sed -i "s|href=\"/\"|href=\"$BASE_PATH/\"|g" "$file"

  # Fix favicon and other assets
  sed -i "s|href=\"/favicon|href=\"$BASE_PATH/favicon|g" "$file"
  sed -i "s|href=\"/icon|href=\"$BASE_PATH/icon|g" "$file"
  sed -i "s|href=\"/manifest|href=\"$BASE_PATH/manifest|g" "$file"
done

echo "Path fixing complete!"
