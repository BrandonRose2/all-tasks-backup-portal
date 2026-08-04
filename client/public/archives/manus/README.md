# Manus Task Archive

This directory is maintained by the repository’s scheduled Manus synchronization workflow. It is a **public archive** whenever the GitHub repository or its Pages deployment is public.

| Path | Purpose |
|---|---|
| `manifest.json` | Per-task archive status, event counts, attachment handling, and recent failures. |
| `tasks/<task-id>.json` | The task index record, retrieved conversation events, and attachment references for one Manus task. |
| `attachments/<task-id>/` | Attachment bytes downloaded from source URLs when they were accessible and within the configured file-size limit. |

The archive script calls the Manus API’s task listing and task message endpoints. It stores ordinary user messages, assistant messages, status records, errors, and attachment references. It does not request verbose internal agent logs.

> The portal PIN is a client-side interface gate only. It does not prevent access to committed files, source code, Git history, or deployed asset URLs. Do not add material here unless public disclosure is intended.

A task can be marked `partial_artifacts` when its conversation was archived but one or more attachments could only be referenced, were too large, or could not be downloaded. A task can be marked `failed` if its message history could not be retrieved during the last archive attempt. Subsequent scheduled runs will retry updated or missing task archives.
