#!/bin/bash

# Create a GitHub Release for audio files
echo "Creating GitHub Release v1.0.0..."
gh release create v1.0.0 \
  --title "GiveWell Board Meetings Audio Files" \
  --notes "Audio files for all 43 board meeting episodes"

echo "Uploading audio files..."
# Upload all MP3 files
for mp3 in board-meetings/*/*.mp3; do
  if [ -f "$mp3" ]; then
    filename=$(basename "$mp3")
    echo "Uploading $filename..."
    gh release upload v1.0.0 "$mp3" --clobber
  fi
done

echo "Done! All audio files uploaded to release."
echo "View release at: https://github.com/parconley/givewell-board-meetings/releases/tag/v1.0.0"
