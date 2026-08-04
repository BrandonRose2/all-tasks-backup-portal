# How to Compile NetSurf from Source on a Raspberry Pi Zero

Compiling software from source on a Raspberry Pi Zero requires patience and preparation. Because the original Pi Zero and Pi Zero W feature a single-core ARM11 processor and only 512 MB of RAM, the compilation process can take several hours (potentially all day) [1]. Furthermore, the limited RAM means the system will quickly run out of memory during the build process unless the swap file size is significantly increased [1].

The following guide details the official "Quick Start" method provided by the NetSurf developers, adapted specifically for the constraints of the Raspberry Pi Zero [2].

## Step 1: Increase the Swap File Size (Critical)

By default, Raspberry Pi OS allocates only 100 MB for the swap file. This is insufficient for compiling a modern web browser and will cause the Pi Zero to freeze or crash during the build process [1]. You must increase the swap size to at least 1 GB (1024 MB), though 2 GB (2048 MB) is safer.

Open the terminal and edit the swap configuration file:

```bash
sudo nano /etc/dphys-swapfile
```

Find the line that reads `CONF_SWAPSIZE=100` and change it to:

```text
CONF_SWAPSIZE=1024
```

Save the file (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`). Then, restart the swap service to apply the changes:

```bash
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## Step 2: Download the NetSurf Build Environment

The NetSurf developers provide a bootstrap script that automates the downloading of dependencies and source code [2].

Create a working directory and download the environment script:

```bash
mkdir -p ~/dev-netsurf
cd ~/dev-netsurf
wget https://git.netsurf-browser.org/netsurf.git/plain/docs/env.sh
```

Source the environment script to load the necessary build functions into your current terminal session:

```bash
unset HOST
source env.sh
```

## Step 3: Install Build Dependencies

With the environment script sourced, you can use its built-in commands. First, install all the necessary packages and libraries required to build NetSurf [2]. This command will automatically use `apt-get` to install dependencies like `libgtk-3-dev`, `libcurl4-dev`, `libpng-dev`, and others.

```bash
ns-package-install
```

*Note: If the script fails to install `make`, you can install it manually by running `sudo apt install make`.*

## Step 4: Clone the Source Code

Next, download the source code for the browser and all of its custom support libraries (such as Hubbub for HTML parsing and LibCSS for CSS rendering) [2].

```bash
ns-clone
```

## Step 5: Build and Install Project Libraries

Before building the browser itself, you must compile NetSurf's custom libraries. The following command updates the library sources to the latest versions, builds them, and installs them into your temporary workspace [2].

```bash
ns-pull-install
```

*Warning: This step will take a significant amount of time on the Pi Zero's single-core processor. It is highly recommended to leave the device running and check back later.*

## Step 6: Switch to the New Workspace

Once the libraries are built, remove the temporary bootstrap script and source the new environment script located in your workspace [2].

```bash
rm env.sh
cd ~/dev-netsurf/workspace
source env.sh
```

## Step 7: Compile the NetSurf Browser

Navigate into the main browser source directory:

```bash
cd netsurf
```

You now have two options for building the browser, depending on how you intend to use your Raspberry Pi Zero:

**Option A: Build for the Desktop (GTK)**
If you are running a desktop environment (like PIXEL/LXDE) on your Pi Zero, build the GTK frontend [3]:

```bash
make
```

**Option B: Build for the Framebuffer (No Desktop)**
If you are running Raspberry Pi OS Lite without a graphical desktop and want to run the browser directly from the terminal, build the framebuffer frontend [4]:

```bash
make TARGET=framebuffer
```

*Warning: This final compilation step is the most resource-intensive and will take several hours to complete.*

## Step 8: Run NetSurf

Once the compilation finishes successfully, you can launch the browser directly from the build directory.

If you built the GTK version (Option A), run:
```bash
./nsgtk3
```

If you built the Framebuffer version (Option B), run:
```bash
./nsfb
```

## Troubleshooting

- **System Freezes During Build:** If the Pi Zero becomes completely unresponsive, it has likely run out of memory. Ensure you completed Step 1 correctly and consider increasing the swap size to 2048 MB.
- **Missing Dependencies:** If the `make` command fails with errors about missing headers or libraries, the `ns-package-install` script may have missed something. You can manually install common missing packages by running: `sudo apt install libgtk-3-dev libcurl4-openssl-dev libpng-dev librsvg2-dev libjpeg-dev`.
- **Alternative to Compiling:** If compiling from source proves too difficult or time-consuming, you can download pre-compiled development packages from the [NetSurf Continuous Integration server](https://ci.netsurf-browser.org/debian/buster/armhf/) [1].

---

### References

[1] [NetSurf Lightweight Web Browser, using the RPI0W computer - Raspberry Pi Forums](https://forums.raspberrypi.com/viewtopic.php?t=259323)
[2] [Quick Build Steps for NetSurf - NetSurf GitHub Repository](https://github.com/netsurf-plan9/netsurf/blob/plan9/docs/quick-start.md)
[3] [Build Instructions for GTK NetSurf - NetSurf GitHub Repository](https://github.com/netsurf-plan9/netsurf/blob/plan9/docs/building-GTK.md)
[4] [Build Instructions for Framebuffer NetSurf - NetSurf GitHub Repository](https://github.com/netsurf-plan9/netsurf/blob/plan9/docs/building-Framebuffer.md)
