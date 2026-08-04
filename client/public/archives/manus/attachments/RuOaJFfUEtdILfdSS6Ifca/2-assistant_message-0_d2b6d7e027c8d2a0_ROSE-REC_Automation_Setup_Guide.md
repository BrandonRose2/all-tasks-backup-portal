# ROSE-REC Audio Automation Setup Guide

This guide will help you set up an automated workflow on your Mac. Whenever you plug in your Disoidoe 136GB Magnetic Voice Recorder (which mounts as `ROSE-REC`), your Mac will automatically detect it and copy any new audio files to your iCloud `Recordings Vault/Inbox` folder.

## Overview of Components

This automation relies on two simple files:
1. **A Shell Script (`auto_copy_audio.sh`)**: This script performs the actual work. It looks for audio files on the recorder, checks if they already exist in your iCloud folder, and copies them over if they are new. It also keeps a log of what was copied.
2. **A LaunchAgent (`com.user.roserec.sync.plist`)**: This is a macOS configuration file that tells your Mac to watch the `/Volumes` folder (where USB drives appear). When a change occurs (like plugging in your recorder), it triggers the shell script.

---

## Step 1: Create the Shell Script

First, we will create the script that handles the file copying.

1. Open the **Terminal** app on your Mac (you can find it using Spotlight Search by pressing `Cmd + Space` and typing "Terminal").
2. Create a directory to store your scripts (if you don't already have one) by running this command:
   ```bash
   mkdir -p ~/Scripts
   ```
3. Open a new file in the nano text editor:
   ```bash
   nano ~/Scripts/auto_copy_audio.sh
   ```
4. Copy the contents of the `auto_copy_audio.sh` file provided with this guide and paste it into the Terminal window.
5. Save the file by pressing `Ctrl + O`, then hit `Enter` to confirm. Exit nano by pressing `Ctrl + X`.
6. Make the script executable so your Mac can run it:
   ```bash
   chmod +x ~/Scripts/auto_copy_audio.sh
   ```

## Step 2: Create the LaunchAgent

Next, we will create the LaunchAgent that watches for your recorder to be plugged in.

1. In Terminal, open a new file in your LaunchAgents directory:
   ```bash
   nano ~/Library/LaunchAgents/com.user.roserec.sync.plist
   ```
2. Copy the contents of the `com.user.roserec.sync.plist` file provided with this guide and paste it into the Terminal window.
3. Save the file by pressing `Ctrl + O`, then hit `Enter`. Exit nano by pressing `Ctrl + X`.

## Step 3: Load the LaunchAgent

Now that both files are in place, you need to tell macOS to start using the LaunchAgent.

1. In Terminal, run the following command to load the LaunchAgent:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.user.roserec.sync.plist
   ```
   *(Note: If you ever need to stop this automation, you can run `launchctl unload ~/Library/LaunchAgents/com.user.roserec.sync.plist`)*

## Step 4: Grant Full Disk Access (Important!)

For the script to access your USB drive and iCloud Drive, Terminal and the `bash` process need permission to read and write files.

1. Open **System Settings** (or System Preferences on older macOS versions).
2. Go to **Privacy & Security**.
3. Click on **Full Disk Access**.
4. Ensure that **Terminal** is toggled **ON**.
5. *(Optional but recommended)*: If the script fails to run silently in the background, you may also need to add `/bin/bash` to this list. To do this, click the `+` button at the bottom of the Full Disk Access list, press `Cmd + Shift + G`, type `/bin/bash`, and hit Enter to add it.

---

## How to Test and Use

1. Unplug your ROSE-REC recorder if it is currently plugged in.
2. Wait a few seconds, then plug it back in.
3. The LaunchAgent will detect the new drive and run the script in the background.
4. Check your iCloud folder at `~/Library/Mobile Documents/com~apple~CloudDocs/Recordings Vault/Inbox/`. Your audio files should start appearing there.
5. You can view the log file to see exactly what was copied by opening this file:
   ```bash
   open ~/Library/Logs/ROSE-REC-Sync.log
   ```

## Troubleshooting

- **Files aren't copying:** Ensure the recorder actually mounts with the exact name `ROSE-REC`. If the name is different, you will need to update the `SOURCE_DIR` variable in the `auto_copy_audio.sh` script.
- **Permission errors in the log:** Double-check Step 4. macOS is very strict about background processes accessing external drives and iCloud.
- **The script runs constantly:** The LaunchAgent watches the `/Volumes` directory. It will trigger whenever *any* drive is mounted or unmounted, but the script is designed to immediately exit if `ROSE-REC` is not present, so this is normal and consumes virtually zero resources.
