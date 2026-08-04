#!/usr/bin/env python3
"""Create a durable, resumable archive of Manus task conversations and attachments.

The script is designed for GitHub Actions. It reads the task index created by
``scripts/sync_tasks.py``, fetches each selected task's non-verbose event history
from the Manus API, and writes one JSON record per task under
``client/public/archives/manus/tasks``. Downloadable attachments are copied to a
per-task directory when they are HTTP(S) resources and are smaller than the
configured safe Git file limit.

The resulting files are public whenever the repository is public. Do not use
this script for confidential material unless public disclosure is intended.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

BASE_URL = "https://api.manus.ai/v2"
REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_FILE = REPO_ROOT / "client" / "public" / "tasks_data.json"
ARCHIVE_ROOT = REPO_ROOT / "client" / "public" / "archives" / "manus"
TASK_ARCHIVE_DIR = ARCHIVE_ROOT / "tasks"
ATTACHMENT_ROOT = ARCHIVE_ROOT / "attachments"
MANIFEST_FILE = ARCHIVE_ROOT / "manifest.json"

DEFAULT_MAX_ARTIFACT_BYTES = 95 * 1024 * 1024
USER_AGENT = "all-tasks-backup-portal/1.0 (+https://github.com/BrandonRose2/all-tasks-backup-portal)"


class ArchiveError(RuntimeError):
    """An expected archive failure that should be reflected in the manifest."""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def atomic_json_write(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False, dir=path.parent, suffix=".tmp") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temp_name = handle.name
    Path(temp_name).replace(path)


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ArchiveError(f"Could not read {path.relative_to(REPO_ROOT)}: {exc}") from exc


def api_get(api_key: str, path: str, params: dict[str, Any] | None = None, retries: int = 5) -> dict[str, Any]:
    query = urllib.parse.urlencode({key: value for key, value in (params or {}).items() if value is not None})
    url = f"{BASE_URL}{path}" + (f"?{query}" if query else "")
    request = urllib.request.Request(url, headers={"x-manus-api-key": api_key, "User-Agent": USER_AGENT})

    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if isinstance(payload, dict) and payload.get("ok") is False:
                message = payload.get("error", {}).get("message") if isinstance(payload.get("error"), dict) else None
                raise ArchiveError(message or f"Manus API returned an unsuccessful response for {path}")
            return payload
        except urllib.error.HTTPError as exc:
            if exc.code == 429 and attempt < retries:
                wait_seconds = min(60, 10 * attempt)
                print(f"Rate limited while requesting {path}; waiting {wait_seconds}s before retry {attempt + 1}/{retries}.", flush=True)
                time.sleep(wait_seconds)
                continue
            detail = exc.read().decode("utf-8", errors="replace")[:500]
            raise ArchiveError(f"Manus API HTTP {exc.code} for {path}: {detail}") from exc
        except urllib.error.URLError as exc:
            if attempt < retries:
                wait_seconds = min(30, 5 * attempt)
                print(f"Network error while requesting {path}; waiting {wait_seconds}s before retry {attempt + 1}/{retries}.", flush=True)
                time.sleep(wait_seconds)
                continue
            raise ArchiveError(f"Network error requesting {path}: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise ArchiveError(f"Invalid JSON returned by Manus API for {path}: {exc}") from exc

    raise ArchiveError(f"Manus API request exhausted retries for {path}")


def fetch_task_events(api_key: str, task_id: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    cursor: str | None = None
    page = 1
    while True:
        payload = api_get(
            api_key,
            "/task.listMessages",
            {"task_id": task_id, "order": "asc", "limit": 200, "cursor": cursor, "verbose": "false"},
        )
        batch = payload.get("messages", [])
        if not isinstance(batch, list):
            raise ArchiveError(f"Unexpected message payload for task {task_id}: messages is not a list")
        events.extend(event for event in batch if isinstance(event, dict))
        if not payload.get("has_more"):
            break
        cursor = payload.get("next_cursor")
        if not cursor:
            raise ArchiveError(f"Task {task_id} reported more messages without a next cursor")
        page += 1
        time.sleep(0.15)
    return events


def iter_attachments(events: Iterable[dict[str, Any]]) -> Iterable[tuple[str, int, dict[str, Any]]]:
    for event_index, event in enumerate(events):
        for message_key in ("user_message", "assistant_message"):
            message = event.get(message_key)
            if not isinstance(message, dict):
                continue
            attachments = message.get("attachments")
            if not isinstance(attachments, list):
                continue
            for attachment_index, attachment in enumerate(attachments):
                if isinstance(attachment, dict):
                    yield f"{event_index}-{message_key}-{attachment_index}", event_index, attachment


def safe_filename(value: str, fallback: str) -> str:
    clean = Path(value).name if value else fallback
    clean = re.sub(r"[^A-Za-z0-9._-]+", "_", clean).strip("._")
    return clean[:120] or fallback


def download_attachment(url: str, destination: Path, max_bytes: int) -> tuple[bool, int, str | None]:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False, 0, f"Unsupported attachment URL scheme: {parsed.scheme or 'none'}"

    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    destination.parent.mkdir(parents=True, exist_ok=True)
    temp_file = destination.with_suffix(destination.suffix + ".part")

    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            declared_size = response.headers.get("Content-Length")
            if declared_size and declared_size.isdigit() and int(declared_size) > max_bytes:
                return False, int(declared_size), f"Attachment exceeds configured limit of {max_bytes} bytes"
            total = 0
            with temp_file.open("wb") as handle:
                while True:
                    chunk = response.read(1024 * 1024)
                    if not chunk:
                        break
                    total += len(chunk)
                    if total > max_bytes:
                        handle.close()
                        temp_file.unlink(missing_ok=True)
                        return False, total, f"Attachment exceeds configured limit of {max_bytes} bytes"
                    handle.write(chunk)
        temp_file.replace(destination)
        return True, total, None
    except (urllib.error.HTTPError, urllib.error.URLError, OSError) as exc:
        temp_file.unlink(missing_ok=True)
        return False, 0, f"Download failed: {exc}"


def task_updated_value(task: dict[str, Any]) -> str:
    return str(task.get("updated_at") or task.get("created_at") or "")


def archived_task_path(task_id: str) -> Path:
    return TASK_ARCHIVE_DIR / f"{task_id}.json"


def relative_public_path(path: Path) -> str:
    return str(path.relative_to(ARCHIVE_ROOT)).replace(os.sep, "/")


def should_archive(task: dict[str, Any], prior: dict[str, Any] | None, mode: str) -> bool:
    if mode == "full":
        return True
    if prior is None:
        return True
    message_path = prior.get("messages_path")
    if not isinstance(message_path, str) or not (ARCHIVE_ROOT / message_path).exists():
        return True
    if mode == "missing":
        return False
    return prior.get("task_updated_at") != task_updated_value(task)


def archive_one_task(api_key: str, task: dict[str, Any], max_artifact_bytes: int, download_artifacts: bool) -> dict[str, Any]:
    task_id = str(task.get("id") or "")
    if not task_id:
        raise ArchiveError("Task index contains an item without an id")

    events = fetch_task_events(api_key, task_id)
    attachment_records: list[dict[str, Any]] = []
    seen_attachment_urls: set[str] = set()

    for ordinal, event_index, attachment in iter_attachments(events):
        url = attachment.get("url")
        filename = str(attachment.get("filename") or "attachment")
        record: dict[str, Any] = {
            "event_index": event_index,
            "type": attachment.get("type", "file"),
            "filename": filename,
            "content_type": attachment.get("content_type", ""),
            "source_url": url if isinstance(url, str) else "",
            "status": "referenced",
        }
        if not isinstance(url, str) or not url:
            record["status"] = "unavailable"
            record["reason"] = "The task event did not include a downloadable URL."
            attachment_records.append(record)
            continue
        if url in seen_attachment_urls:
            record["status"] = "duplicate_reference"
            attachment_records.append(record)
            continue
        seen_attachment_urls.add(url)

        if not download_artifacts:
            attachment_records.append(record)
            continue

        extension = Path(urllib.parse.urlparse(url).path).suffix[:12]
        file_hash = hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]
        local_name = f"{ordinal}_{file_hash}_{safe_filename(filename, 'attachment' + extension)}"
        destination = ATTACHMENT_ROOT / task_id / local_name
        success, size, reason = download_attachment(url, destination, max_artifact_bytes)
        record["bytes"] = size
        if success:
            record["status"] = "archived"
            record["archive_path"] = relative_public_path(destination)
        else:
            record["status"] = "referenced_only"
            record["reason"] = reason
        attachment_records.append(record)

    task_document = {
        "schema_version": 1,
        "archived_at": utc_now(),
        "task": task,
        "event_count": len(events),
        "events": events,
        "attachments": attachment_records,
    }
    destination = archived_task_path(task_id)
    atomic_json_write(destination, task_document)

    archived_artifacts = sum(1 for item in attachment_records if item.get("status") == "archived")
    referenced_only = sum(1 for item in attachment_records if item.get("status") in {"referenced", "referenced_only", "unavailable"})
    return {
        "task_updated_at": task_updated_value(task),
        "archived_at": task_document["archived_at"],
        "messages_path": relative_public_path(destination),
        "event_count": len(events),
        "attachment_count": len(attachment_records),
        "archived_attachment_count": archived_artifacts,
        "referenced_only_attachment_count": referenced_only,
        "status": "complete" if referenced_only == 0 else "partial_artifacts",
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("updated", "missing", "full"), default="updated", help="Select newly seen, updated, or all tasks for archive retrieval.")
    parser.add_argument("--max-tasks", type=int, default=0, help="Maximum tasks to process in this run; 0 means no limit.")
    parser.add_argument("--max-artifact-bytes", type=int, default=DEFAULT_MAX_ARTIFACT_BYTES, help="Maximum size for an individual downloaded artifact.")
    parser.add_argument("--skip-artifacts", action="store_true", help="Store attachment references but do not download attachment bytes.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    api_key = os.environ.get("MANUS_API_KEY")
    if not api_key:
        print("ERROR: MANUS_API_KEY environment variable not set.", file=sys.stderr)
        return 2
    if args.max_tasks < 0:
        print("ERROR: --max-tasks must be zero or greater.", file=sys.stderr)
        return 2
    if args.max_artifact_bytes <= 0:
        print("ERROR: --max-artifact-bytes must be greater than zero.", file=sys.stderr)
        return 2

    tasks_payload = load_json(TASKS_FILE, {})
    tasks = tasks_payload.get("tasks", []) if isinstance(tasks_payload, dict) else []
    if not isinstance(tasks, list):
        print("ERROR: tasks_data.json has no task list.", file=sys.stderr)
        return 2

    manifest = load_json(MANIFEST_FILE, {})
    if not isinstance(manifest, dict):
        manifest = {}
    prior_tasks = manifest.get("tasks", {})
    if not isinstance(prior_tasks, dict):
        prior_tasks = {}

    selected = [task for task in tasks if isinstance(task, dict) and should_archive(task, prior_tasks.get(str(task.get("id") or "")), args.mode)]
    if args.max_tasks:
        selected = selected[: args.max_tasks]

    print(f"Preparing {len(selected)} task archive(s) using mode={args.mode} from {len(tasks)} indexed task(s).", flush=True)
    manifest.update({
        "schema_version": 1,
        "source": "Manus API v2 task.listMessages",
        "last_attempt_at": utc_now(),
        "task_index_last_synced": tasks_payload.get("meta", {}).get("last_synced") if isinstance(tasks_payload, dict) else None,
        "total_indexed_tasks": len(tasks),
        "tasks": prior_tasks,
    })

    failures: list[dict[str, str]] = []
    for position, task in enumerate(selected, start=1):
        task_id = str(task.get("id") or "")
        title = str(task.get("title") or "Untitled Task")
        print(f"[{position}/{len(selected)}] Archiving {task_id}: {title}", flush=True)
        try:
            prior_tasks[task_id] = archive_one_task(api_key, task, args.max_artifact_bytes, not args.skip_artifacts)
        except ArchiveError as exc:
            print(f"WARNING: Could not archive {task_id}: {exc}", file=sys.stderr, flush=True)
            prior_tasks[task_id] = {
                "task_updated_at": task_updated_value(task),
                "archived_at": utc_now(),
                "status": "failed",
                "error": str(exc),
            }
            failures.append({"task_id": task_id, "title": title, "error": str(exc)})
        atomic_json_write(MANIFEST_FILE, manifest)
        time.sleep(0.1)

    complete_count = sum(1 for record in prior_tasks.values() if isinstance(record, dict) and record.get("status") == "complete")
    partial_count = sum(1 for record in prior_tasks.values() if isinstance(record, dict) and record.get("status") == "partial_artifacts")
    failed_count = sum(1 for record in prior_tasks.values() if isinstance(record, dict) and record.get("status") == "failed")
    manifest.update({
        "last_synced": utc_now(),
        "last_mode": args.mode,
        "archive_status": "complete" if failed_count == 0 else "completed_with_failures",
        "complete_task_count": complete_count,
        "partial_artifact_task_count": partial_count,
        "failed_task_count": failed_count,
        "failures": failures[-100:],
    })
    atomic_json_write(MANIFEST_FILE, manifest)

    print(
        f"Archive complete: {complete_count} fully archived, {partial_count} with referenced-only artifacts, {failed_count} failed task(s).",
        flush=True,
    )
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
