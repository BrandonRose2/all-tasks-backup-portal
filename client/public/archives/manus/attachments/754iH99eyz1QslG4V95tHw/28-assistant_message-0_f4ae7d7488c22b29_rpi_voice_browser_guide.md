# How to Set Up Voice-Controlled Browser Navigation on a Raspberry Pi

Yes, you can absolutely set up a Raspberry Pi to take voice commands and switch between specific browser pages (like moving from a "Vacancy Report" to a "Manager KPI Performance" dashboard). 

Because the Raspberry Pi is a full Linux computer, you have several ways to accomplish this. The core challenge is bridging the gap between a voice assistant (like Alexa) and the local web browser running on the Pi. 

Here are the three best approaches, ranging from the easiest smart-home integration to a fully offline, privacy-focused solution.

---

## Approach 1: The Node-RED Smart Home Method (Recommended)

This is the most reliable method if you already have an Amazon Echo device. It tricks Alexa into thinking your browser pages are "smart home devices" (like smart light bulbs) that can be turned on or off.

### How it works:
You install Node-RED (a visual programming tool) on the Raspberry Pi. Using a plugin, Node-RED emulates a Philips Hue smart hub on your local network. You create virtual devices named "Vacancy Report" and "Manager KPI Performance". When you say, *"Alexa, turn on Manager KPI Performance,"* Alexa sends a signal to Node-RED, which then executes a script to change the browser URL.

### Step-by-Step Setup:
1. **Install Node-RED on the Pi:**
   Open the terminal and run the official installation script:
   ```bash
   bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)
   ```
2. **Install the Alexa Plugin:**
   Open the Node-RED interface in your browser (`http://<pi-ip-address>:1880`). Go to "Manage Palette" and install `node-red-contrib-alexa-home`.
3. **Create Virtual Devices:**
   Drag the Alexa node onto your workspace and create two devices: "Vacancy Report" and "Manager KPI Performance".
4. **Discover Devices:**
   Say, *"Alexa, discover devices."* Your Echo will find the two new "smart devices."
5. **Set Up the Browser Control:**
   Connect the Alexa nodes to an "Exec" node in Node-RED. Configure the Exec node to run a script that changes the Chromium browser URL (see the "How to Change the URL" section below).

---

## Approach 2: The Webhook & API Method

If you want to use custom Alexa Routines or third-party skills, you can run a tiny web server on the Raspberry Pi that listens for commands over the network.

### How it works:
You write a simple Python script using the Flask framework to create a local API. You then use a third-party Alexa skill (like "URL Switch" by Virtual Smart Home) to send a webhook to your Pi when you speak a specific phrase.

### Step-by-Step Setup:
1. **Create the Python API:**
   Install Flask (`pip install flask`) and create a script with endpoints for your pages:
   ```python
   from flask import Flask
   import subprocess

   app = Flask(__name__)

   @app.route('/switch/vacancy')
   def vacancy():
       # Command to switch browser URL
       subprocess.run(["./change_url.sh", "http://your-server/vacancy-report"])
       return "Switched to Vacancy Report"

   @app.route('/switch/kpi')
   def kpi():
       subprocess.run(["./change_url.sh", "http://your-server/manager-kpi"])
       return "Switched to KPI"

   if __name__ == '__main__':
       app.run(host='0.0.0.0', port=5000)
   ```
2. **Connect to Alexa:**
   Use the [URL Switch Alexa Skill](https://www.virtualsmarthome.xyz/url_switch/). Create a switch that points to `http://<pi-ip-address>:5000/switch/kpi`.
3. **Create a Routine:**
   In the Alexa app, create a routine: *When I say "Show Manager KPI", turn on the KPI URL Switch.*

*(Note: For this to work, your Pi must be accessible to the internet, which may require setting up port forwarding on your router or using a secure tunnel service like ngrok).*

---

## Approach 3: The Fully Offline Method (No Alexa Required)

If you want to avoid cloud services entirely (for privacy or reliability reasons), you can plug a USB microphone directly into the Raspberry Pi and use offline voice recognition.

### How it works:
You use an open-source speech recognition toolkit called **Vosk**. It runs entirely locally on the Pi, constantly listening for specific keywords.

### Step-by-Step Setup:
1. **Hardware:** Plug a USB microphone into the Raspberry Pi.
2. **Install Vosk:**
   ```bash
   pip3 install vosk sounddevice
   ```
3. **Download a Language Model:** Download the lightweight (50MB) English model from the Vosk website and extract it to your Pi.
4. **Write the Listener Script:**
   Write a Python script that listens to the microphone stream. When the script detects the phrase "show vacancy report", it triggers the browser to change the URL. When it hears "show manager KPI", it switches to the other dashboard.

---

## The "Last Mile": How to Actually Change the Browser URL

Regardless of which approach you choose above, you need a way to force the Chromium browser (which is likely running in full-screen Kiosk mode) to change its page without using a keyboard.

The best way to do this is by launching Chromium with remote debugging enabled.

**1. Launch Chromium with Debugging:**
Instead of launching Chromium normally, start it with this flag:
```bash
chromium-browser --kiosk --remote-debugging-port=9222 http://your-server/vacancy-report
```

**2. Change the URL via Script:**
You can now use a simple Node.js or Python script to talk to Chromium's debugging port and tell it to navigate to a new page. Here is an example using the `chrome-remote-interface` tool:

```bash
# Install the tool
npm install -g chrome-remote-interface

# Command to change the page
chrome-remote-interface navigate http://your-server/manager-kpi
```

Whenever your voice command is recognized (via Node-RED, Flask, or Vosk), simply have the system execute that `chrome-remote-interface` command, and the screen will instantly switch to the Manager KPI Performance page.
