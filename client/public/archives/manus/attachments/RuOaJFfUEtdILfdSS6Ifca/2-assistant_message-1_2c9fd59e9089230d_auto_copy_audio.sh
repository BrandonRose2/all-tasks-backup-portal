#!/bin/bash

# ==============================================================================
# Script: auto_copy_audio.sh
# Description: Automatically copies new audio files from ROSE-REC to iCloud
# ==============================================================================

# Define variables
SOURCE_DIR="/Volumes/ROSE-REC"
DEST_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Recordings Vault/Inbox"
LOG_FILE="$HOME/Library/Logs/ROSE-REC-Sync.log"

# Log function
log_msg() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Give the system a moment to fully mount the drive
sleep 2

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    # Exit silently if the drive isn't mounted
    exit 0
fi

log_msg "ROSE-REC detected. Starting sync..."

# Ensure destination directory exists
mkdir -p "$DEST_DIR"

# Find all audio files and copy them if they don't exist in destination
# Using find with case-insensitive matching for common audio extensions
count=0
while IFS= read -r -d '' file; do
    filename=$(basename "$file")
    dest_path="$DEST_DIR/$filename"
    
    # Check if file already exists in destination
    if [ ! -f "$dest_path" ]; then
        # Copy the file
        cp "$file" "$dest_path"
        log_msg "Copied: $filename"
        ((count++))
    fi
done < <(find "$SOURCE_DIR" -type f \( -iname "*.mp3" -o -iname "*.wav" -o -iname "*.m4a" -o -iname "*.wma" -o -iname "*.flac" \) -print0)

log_msg "Sync complete. $count new file(s) copied."
log_msg "----------------------------------------"
