#!/usr/bin/env python3
"""
Friday Sync Script (Claude's portion)
Syncs every Friday at 6AM PST via GitHub Actions:
  1. github_repos.json  — all repos + live starred status via GitHub API
  2. claude_tasks.json  — Claude tasks pulled from brandons-task-vault
"""

import json, os, sys, urllib.request, urllib.error
from datetime import datetime, timezone

GITHUB_TOKEN    = os.environ.get("SYNC_GITHUB_PAT")
GITHUB_USERNAME = "BrandonRose2"
BASE_DIR        = os.path.join(os.path.dirname(__file__), "..", "client", "public")
REPOS_FILE      = os.path.join(BASE_DIR, "github_repos.json")
CLAUDE_FILE     = os.path.join(BASE_DIR, "claude_tasks.json")

if not GITHUB_TOKEN:
    print("ERROR: SYNC_GITHUB_PAT secret not set.")
    sys.exit(1)

def github_get(path):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def sync_github_repos():
    print("\n[1/2] Syncing GitHub repos + starred status...")

    # Load existing repos to preserve categories/descriptions
    existing = {}
    if os.path.exists(REPOS_FILE):
        try:
            for r in json.load(open(REPOS_FILE)):
                existing[r["name"]] = r
            print(f"  Loaded {len(existing)} existing repos.")
        except Exception as e:
            print(f"  Warning: {e}")

    # Fetch all starred repos
    starred_names, page = set(), 1
    while True:
        results = github_get(f"/users/{GITHUB_USERNAME}/starred?per_page=100&page={page}")
        if not results: break
        for r in results:
            starred_names.add(r["name"])
        if len(results) < 100: break
        page += 1

    print(f"  Found {len(starred_names)} starred repos on GitHub.")

    # Fetch all user repos
    all_repos, page = [], 1
    while True:
        results = github_get(f"/users/{GITHUB_USERNAME}/repos?per_page=100&page={page}")
        if not results: break
        all_repos.extend(results)
        if len(results) < 100: break
        page += 1

    # Update starred flags on existing repos
    merged = list(existing.values())
    existing_names = set(existing.keys())
    for r in merged:
        r["starred"] = r["name"] in starred_names

    # Add any newly starred repos not yet tracked
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
    print(f"  ✅ {len(merged)} repos ({total_starred} starred).")

def sync_claude_tasks():
    print("\n[2/2] Syncing Claude tasks from brandons-task-vault...")
    try:
        req = urllib.request.Request(
            "https://raw.githubusercontent.com/BrandonRose2/brandons-task-vault/main/claude_tasks.json",
            headers={"Authorization": f"token {GITHUB_TOKEN}"}
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            tasks = json.loads(r.read().decode())
        json.dump(tasks, open(CLAUDE_FILE, "w"), indent=2)
        print(f"  ✅ {len(tasks)} Claude tasks.")
    except Exception as e:
        print(f"  ⚠️  Could not sync Claude tasks: {e}")
        sys.exit(1)

def main():
    print(f"{'='*55}")
    print(f"Friday Sync — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*55}")
    sync_github_repos()
    sync_claude_tasks()
    print(f"\n✅ Friday sync complete.")

if __name__ == "__main__":
    main()
