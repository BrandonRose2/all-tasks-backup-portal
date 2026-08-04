"""
Referral Flyer Generator – Local Photo Server
Run this alongside Referral_Flyer_Generator.html
It serves photos from the "Property Photos" subfolders and provides
a /photos/<folder> API endpoint that lists all images in a building's folder.
"""

import os, json, mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote, urlparse, parse_qs

# The server looks for "Property Photos" relative to its own location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PHOTOS_DIR = os.path.join(BASE_DIR, "Property Photos")

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress console noise

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        # ── /list/<folder> → JSON list of image filenames ──
        if path.startswith("/list/"):
            folder_name = path[6:]  # strip "/list/"
            folder_path = os.path.join(PHOTOS_DIR, folder_name)
            if os.path.isdir(folder_path):
                files = sorted([
                    f for f in os.listdir(folder_path)
                    if os.path.splitext(f)[1].lower() in IMAGE_EXTS
                ])
            else:
                files = []
            body = json.dumps(files).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_cors()
            self.end_headers()
            self.wfile.write(body)
            return

        # ── /photo/<folder>/<filename> → serve the image file ──
        if path.startswith("/photo/"):
            rel = path[7:]  # strip "/photo/"
            file_path = os.path.join(PHOTOS_DIR, rel)
            # Security: make sure we stay inside PHOTOS_DIR
            if not os.path.abspath(file_path).startswith(os.path.abspath(PHOTOS_DIR)):
                self.send_response(403)
                self.end_headers()
                return
            if os.path.isfile(file_path):
                mime, _ = mimetypes.guess_type(file_path)
                mime = mime or "application/octet-stream"
                with open(file_path, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", mime)
                self.send_header("Content-Length", str(len(data)))
                self.send_cors()
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_response(404)
                self.end_headers()
            return

        # ── /app → serve the HTML app ──
        if path in ("/", "/app", "/index.html"):
            html_path = os.path.join(BASE_DIR, "Referral_Flyer_Generator.html")
            if os.path.isfile(html_path):
                with open(html_path, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.send_cors()
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_response(404)
                self.end_headers()
            return

        # ── /photos/<path> → serve static files (fallback photos) ──
        if path.startswith("/photos/"):
            file_path = os.path.join(BASE_DIR, path.lstrip("/"))
            if os.path.isfile(file_path):
                mime, _ = mimetypes.guess_type(file_path)
                mime = mime or "application/octet-stream"
                with open(file_path, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", mime)
                self.send_header("Content-Length", str(len(data)))
                self.send_cors()
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_response(404)
                self.end_headers()
            return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    port = 8765
    print(f"✅  Referral Flyer Photo Server running at http://localhost:{port}")
    print(f"📁  Serving photos from: {PHOTOS_DIR}")
    print(f"🌐  Open your browser to: http://localhost:{port}/app")
    print("    (Press Ctrl+C to stop)\n")
    HTTPServer(("", port), Handler).serve_forever()
