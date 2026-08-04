# OpenJarvis Setup Guide

Based on the screen recording you provided, you are setting up **OpenJarvis**, a local-first personal AI framework developed as part of the Intelligence Per Watt research initiative at Stanford SAIL [1]. The video shows the desktop application's settings page, where various API keys, memory backends, model defaults, and speech settings can be configured. 

This guide provides comprehensive, step-by-step instructions on how to install and configure OpenJarvis exactly as shown in your recording.

## 1. Installation

OpenJarvis is designed to run locally on your hardware, using local models by default. 

### macOS and Linux
The easiest way to install OpenJarvis on macOS or Linux is using the official installation script. This script automatically handles dependencies (like Python and Node.js), installs Ollama (the recommended inference engine), and downloads a starter model [2].

Open your terminal and run:
```bash
curl -fsSL https://open-jarvis.github.io/OpenJarvis/install.sh | bash
```

### Windows
For native Windows, run the following in PowerShell:
```powershell
irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex
```
Alternatively, you can install it via WSL2 using the Linux curl command above.

### Desktop App
Since your screen recording shows the native macOS desktop application, you can download the latest `.dmg` (for macOS) or `.exe` (for Windows) from the OpenJarvis GitHub Releases page. 
Once installed, the app will automatically connect to the local backend API server running at `http://localhost:8000` [2].

*Note for macOS users: If the app shows as "damaged" when you first open it, clear the Gatekeeper quarantine flag by running `xattr -cr /Applications/OpenJarvis.app` in your terminal.*

## 2. Configuration Based on Your Settings

The settings page in your video corresponds to the configuration file located at `~/.openjarvis/config.toml`. You can configure these either through the UI (as you were doing) or by editing the TOML file directly [3].

### API Keys
While OpenJarvis is local-first, it supports cloud models for complex reasoning or specific tasks. In the "API Keys" section of your video, you can input keys for:
*   **OpenAI:** For GPT-4, GPT-3.5, etc.
*   **Anthropic:** For Claude models.
*   **Google:** For Gemini models.
*   **OpenRouter:** For multi-provider routing.

To use these, ensure the cloud engine is installed (`uv sync --extra inference-cloud`) and set the corresponding environment variables (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) or enter them directly in the UI [3].

### Tools (Web Search)
The video shows a field for a Web Search API key. OpenJarvis uses **Tavily** (or SerpAPI) for its `web_search` tool. 
To enable this, you need to provide a `TAVILY_API_KEY` [3]. You can get one by signing up at tavily.com.

### Memory Backend
Your video showed the Memory status as "Unavailable". To fix this and enable the automatic context injection:
1.  Ensure you have the Rust extension built. If you installed via the script, this happens in the background. If you installed manually, run: `uv run maturin develop -m rust/crates/openjarvis-python/Cargo.toml`.
2.  The default backend is `sqlite` (which was selected in your dropdown). It requires no extra dependencies.
3.  To make it available, you need to index some documents first. From the terminal, run:
    ```bash
    jarvis memory index /path/to/your/documents/
    ```
4.  Once indexed, the memory context injection will work using the sliders you had set (Results: 5, Min relevance: 0.1, Max tokens: 2048) [4].

### Model Defaults
Your settings showed:
*   **Temperature:** 0.7
*   **Max tokens:** 4096

These dictate how creative and how long the AI's responses will be. 0.7 is a good default for balanced chat.

### Speech Backend
The video showed the Speech-to-Text backend as "Not configured". OpenJarvis supports local transcription via **Whisper** or cloud transcription via **Deepgram** [5].

To set up a speech backend:
1.  **For Deepgram (Cloud - Faster):** You will need a Deepgram API key.
2.  **For Whisper (Local - Private):** You will need to install Whisper and its dependencies locally.
You will need to ensure the `desktop` extra is installed (`uv sync --extra desktop`) to enable local speech input.

## 3. Starting the Application

Once everything is installed and configured:

1.  **Start the Backend:** If you used the install script, the backend might already be running. If not, start Ollama (`ollama serve`) and the Jarvis server (`jarvis serve --port 8000`).
2.  **Open the App:** Launch the OpenJarvis desktop application.
3.  **Select a Model:** Use the dropdown in the top left (which showed `gemma3:latest` in your video) to select your preferred local model.

You are now ready to use your private, local-first AI assistant!

## References

[1] [OpenJarvis GitHub Repository](https://github.com/open-jarvis/OpenJarvis)
[2] [OpenJarvis Installation Guide](https://open-jarvis.github.io/OpenJarvis/getting-started/installation/)
[3] [OpenJarvis Configuration Documentation](https://open-jarvis.github.io/OpenJarvis/getting-started/configuration/)
[4] [OpenJarvis Quick Start - Memory](https://open-jarvis.github.io/OpenJarvis/getting-started/quickstart/)
[5] [OpenJarvis Deepgram API Reference](https://open-jarvis.github.io/OpenJarvis/api-reference/openjarvis/speech/deepgram/)
