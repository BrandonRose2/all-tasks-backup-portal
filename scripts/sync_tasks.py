#!/usr/bin/env python3
"""
Manus Task Sync Script
Fetches all tasks from the Manus API and updates client/public/tasks_data.json
Run via GitHub Actions on a schedule to keep the dashboard in sync.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone

API_KEY = os.environ.get("MANUS_API_KEY")
if not API_KEY:
    print("ERROR: MANUS_API_KEY environment variable not set.")
    sys.exit(1)

BASE_URL = "https://api.manus.ai/v2"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "client", "public", "tasks_data.json")

def api_get(path, params=None):
    url = f"{BASE_URL}{path}"
    if params:
        query = "&".join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{query}"
    req = urllib.request.Request(url, headers={"x-manus-api-key": API_KEY})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 10 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Max retries exceeded")

def fetch_all_tasks():
    tasks = []
    cursor = None
    page = 1
    while True:
        params = {"limit": 100}
        if cursor:
            params["cursor"] = cursor
        print(f"  Fetching page {page}...")
        data = api_get("/task.list", params)
        batch = data.get("data", [])
        tasks.extend(batch)
        next_cursor = data.get("next_cursor")
        if not next_cursor or not batch:
            break
        cursor = next_cursor
        page += 1
        time.sleep(0.5)
    return tasks

def normalize_task(t):
    return {
        "id": t.get("id", ""),
        "title": t.get("title", "Untitled Task"),
        "status": t.get("status", "unknown"),
        "type": t.get("task_type", "standard"),
        "agent_profile": t.get("agent_profile", "manus-1.6"),
        "credits_used": t.get("credit_usage", 0),
        "created_at": t.get("created_at", ""),
        "updated_at": t.get("updated_at", ""),
        "task_url": t.get("task_url", ""),
        "message_count": t.get("message_count", 0),
    }

def main():
    print(f"[{datetime.now(timezone.utc).isoformat()}] Starting Manus task sync...")

    # Load existing data to preserve any user edits (custom notes, deletions)
    existing = {}
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r") as f:
                old_data = json.load(f)
            for t in old_data.get("tasks", []):
                existing[t["id"]] = t
            print(f"  Loaded {len(existing)} existing tasks from file.")
        except Exception as e:
            print(f"  Warning: could not load existing file: {e}")

    print("  Fetching tasks from Manus API...")
    raw_tasks = fetch_all_tasks()
    print(f"  Fetched {len(raw_tasks)} tasks from API.")

    # Merge: API data wins for all fields, but preserve user-added custom fields
    merged = []
    for t in raw_tasks:
        norm = normalize_task(t)
        if norm["id"] in existing:
            old = existing[norm["id"]]
            # Preserve user-added custom fields
            for custom_field in ["custom_notes", "starred", "user_deleted"]:
                if custom_field in old:
                    norm[custom_field] = old[custom_field]
            # Skip tasks the user has manually deleted
            if old.get("user_deleted"):
                continue
        merged.append(norm)

    # Sort newest first
    merged.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    output = {
        "tasks": merged,
        "meta": {
            "total": len(merged),
            "last_synced": datetime.now(timezone.utc).isoformat(),
            "source": "manus_api_sync",
        }
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"  Wrote {len(merged)} tasks to {OUTPUT_FILE}")
    print(f"[{datetime.now(timezone.utc).isoformat()}] Sync complete.")

if __name__ == "__main__":
    main()
