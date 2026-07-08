#!/usr/bin/env python3
"""
Friday Full Sync Script
Syncs three data sources every Friday:
  1. tasks_data.json     — all Manus tasks via Manus API
  2. github_repos.json   — all repos + live starred status via GitHub API
  3. claude_tasks.json   — Claude tasks from brandons-task-vault repo
"""

import json
import os
import sys
import time
import base64
import urllib.request
import urllib.error
from datetime import datetime, timezone

# ── Credentials ──────────────────────────────────────────────────────────────
MANUS_API_KEY   = os.environ.get("MANUS_API_KEY")
GITHUB_TOKEN    = os.environ.get("GITHUB_TOKEN_SYNC") or os.environ.get("GITHUB_TOKEN")
GITHUB_USERNAME = "BrandonRose2"

# ── Output paths (relative to repo root) ─────────────────────────────────────
BASE_DIR        = os.path.join(os.path.dirname(__file__), "..", "client", "public")
TASKS_FILE      = os.path.join(BASE_DIR, "tasks_data.json")
REPOS_FILE      = os.path.join(BASE_DIR, "github_repos.json")
CLAUDE_FILE     = os.path.join(BASE_DIR, "claude_tasks.json")

MANUS_BASE      = "https://api.manus.ai/v2"
GITHUB_BASE     = "https://api.github.com"

# ── Helpers ───────────────────────────────────────────────────────────────────
def github_get(path, token=None):
    url = f"{GITHUB_BASE}{path}"
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def manus_get(path, params=None):
    url = f"{MANUS_BASE}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url, headers={"x-manus-api-key": MANUS_API_KEY})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 10 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Max retries exceeded")

# ── 1. Manus tasks ────────────────────────────────────────────────────────────
def sync_manus_tasks():
    if not MANUS_API_KEY:
        print("⚠️  MANUS_API_KEY not set — skipping Manus task sync.")
        return

    print("\n[1/3] Syncing Manus tasks...")
    existing = {}
    if os.path.exists(TASKS_FILE):
        try:
            old = json.load(open(TASKS_FILE))
            for t in old.get("tasks", []):
                existing[t["id"]] = t
            print(f"  Loaded {len(existing)} existing tasks.")
        except Exception as e:
            print(f"  Warning: {e}")

    tasks, cursor, page = [], None, 1
    while True:
        params = {"limit": 100}
        if cursor:
            params["cursor"] = cursor
        print(f"  Fetching page {page}...")
        data = manus_get("/task.list", params)
        batch = data.get("data", [])
        tasks.extend(batch)
        cursor = data.get("next_cursor")
        if not cursor or not batch:
            break
        page += 1
        time.sleep(0.5)

    merged = []
    for t in tasks:
        norm = {
            "id":            t.get("id", ""),
            "title":         t.get("title", "Untitled"),
            "status":        t.get("status", "unknown"),
            "type":          t.get("task_type", "standard"),
            "agent_profile": t.get("agent_profile", "manus-1.6"),
            "credits_used":  t.get("credit_usage", 0),
            "created_at":    t.get("created_at", ""),
            "updated_at":    t.get("updated_at", ""),
            "task_url":      t.get("task_url", ""),
            "message_count": t.get("message_count", 0),
        }
        if norm["id"] in existing:
            old = existing[norm["id"]]
            for field in ["custom_notes", "starred", "user_deleted"]:
                if field in old:
                    norm[field] = old[field]
            if old.get("user_deleted"):
                continue
        merged.append(norm)

    merged.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    output = {
        "tasks": merged,
        "meta": {
            "total": len(merged),
            "last_synced": datetime.now(timezone.utc).isoformat(),
            "source": "manus_api_sync",
        }
    }
    os.makedirs(BASE_DIR, exist_ok=True)
    json.dump(output, open(TASKS_FILE, "w"), indent=2)
    print(f"  ✅ Wrote {len(merged)} Manus tasks.")

# ── 2. GitHub repos + starred ─────────────────────────────────────────────────
def sync_github_repos():
    print("\n[2/3] Syncing GitHub repos + starred status...")

    # Load existing repos to preserve categories and descriptions
    existing = {}
    if os.path.exists(REPOS_FILE):
        try:
            for r in json.load(open(REPOS_FILE)):
                existing[r["name"]] = r
            print(f"  Loaded {len(existing)} existing repos.")
        except Exception as e:
            print(f"  Warning: {e}")

    # Fetch all starred repos
    starred_names = set()
    page = 1
    while True:
        try:
            results = github_get(
                f"/users/{GITHUB_USERNAME}/starred?per_page=100&page={page}",
                token=GITHUB_TOKEN
            )
            if not results:
                break
            for r in results:
                starred_names.add(r["name"])
            if len(results) < 100:
                break
            page += 1
        except Exception as e:
            print(f"  Warning fetching starred: {e}")
            break

    print(f"  Found {len(starred_names)} starred repos on GitHub.")

    # Fetch all user repos
    all_repos = []
    page = 1
    while True:
        try:
            results = github_get(
                f"/users/{GITHUB_USERNAME}/repos?per_page=100&page={page}",
                token=GITHUB_TOKEN
            )
            if not results:
                break
            all_repos.extend(results)
            if len(results) < 100:
                break
            page += 1
        except Exception as e:
            print(f"  Warning fetching repos: {e}")
            break

    print(f"  Found {len(all_repos)} total repos for {GITHUB_USERNAME}.")

    # Merge: update starred status on all known repos; add new ones
    merged = list(existing.values())
    existing_names = set(existing.keys())

    # Update starred flag on all existing repos
    for r in merged:
        r["starred"] = r["name"] in starred_names

    # Add any new starred repos not yet in the list
    for r in all_repos:
        if r["name"] not in existing_names and r["name"] in starred_names:
            merged.append({
                "name":        r["name"],
                "url":         r["html_url"],
                "description": r.get("description") or "No description",
                "category":    "Resources & References",
                "updated":     r.get("updated_at", "")[:7],
                "starred":     True,
            })

    json.dump(merged, open(REPOS_FILE, "w"), indent=2)
    total_starred = sum(1 for r in merged if r.get("starred"))
    print(f"  ✅ Wrote {len(merged)} repos ({total_starred} starred).")

# ── 3. Claude tasks from brandons-task-vault ──────────────────────────────────
def sync_claude_tasks():
    print("\n[3/3] Syncing Claude tasks from brandons-task-vault...")
    try:
        url = "https://raw.githubusercontent.com/BrandonRose2/brandons-task-vault/main/claude_tasks.json"
        req = urllib.request.Request(url)
        if GITHUB_TOKEN:
            req.add_header("Authorization", f"token {GITHUB_TOKEN}")
        with urllib.request.urlopen(req, timeout=30) as r:
            tasks = json.loads(r.read().decode())
        json.dump(tasks, open(CLAUDE_FILE, "w"), indent=2)
        print(f"  ✅ Wrote {len(tasks)} Claude tasks.")
    except Exception as e:
        print(f"  ⚠️  Could not sync Claude tasks: {e}")

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print(f"{'='*60}")
    print(f"Friday Full Sync — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*60}")
    sync_manus_tasks()
    sync_github_repos()
    sync_claude_tasks()
    print(f"\n{'='*60}")
    print("Friday sync complete.")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
