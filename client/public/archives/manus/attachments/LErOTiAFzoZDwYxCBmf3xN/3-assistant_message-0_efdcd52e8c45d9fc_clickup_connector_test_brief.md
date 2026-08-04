# ClickUp Connector Test Brief

**Test date:** July 14, 2026  
**Test method:** Live, read-only connector calls against the connected ClickUp account

## Result

> **The ClickUp connector is enabled, authenticated, and working.**

The test successfully discovered **three accessible workspaces**, retrieved their space hierarchy, searched recent tasks, and fetched compact details for a selected task. No ClickUp records were created, changed, commented on, or deleted.

| Test | Outcome | Evidence |
|---|---|---|
| Connector configuration | Passed | ClickUp was present and enabled for the current task. |
| Workspace discovery | Passed | Three workspace IDs were returned. |
| Hierarchy retrieval | Passed | Space, folder, and list structures were returned. |
| Cross-workspace handling | Passed | The connector requested an explicit workspace ID because multiple workspaces are available. |
| Task search | Passed | Five recent task results were returned from the selected workspace. |
| Direct task lookup | Passed | Compact details for task `86b8zecf8` were retrieved. |

## Sample of Data Fetched

To minimize exposure of internal information, this brief includes only a small, non-sensitive subset of the retrieved data.

| Workspace ID | Spaces found | Example space names |
|---|---:|---|
| `90141033101` | 1 | Apartment Corp Workspace |
| `90141034985` | 1 | Team Space |
| `90141135992` | 4 | Team Space; Vacancy Report Webapp; Manager's Contact List; PropertyMax.ai |

A recent-task search in workspace `90141033101` returned the following representative records:

| Task | Status | Location |
|---|---|---|
| Collections | completed | PropertyMax AI Training Hub — Video Tracker |
| Vacancy Report App | Closed | Projects |
| Phone Excellence | completed | PropertyMax AI Training Hub — Video Tracker |

The direct lookup of **Vacancy Report App** returned task ID `86b8zecf8`, status **Closed**, list **Projects**, folder **Notion Tasks**, no assignees, four custom fields, no subtasks, and one watcher. The task is available in [ClickUp][1].

## Connector Capabilities

The current ClickUp connector exposes **52 operations** across the following areas.

| Capability area | What it can do |
|---|---|
| Universal search | Search tasks, documents, dashboards, attachments, whiteboards, chats, and forms; filter by status, creator, assignee, location, asset type, and dates. |
| Task management | Create, retrieve, filter, update, move, add to multiple lists, remove from lists, merge, and delete tasks. |
| Collaboration | Read and create comments, retrieve threaded replies, attach files, and manage task links and dependencies. |
| Time tracking | Start or stop timers, add manual entries, retrieve entries, and inspect time spent in each status when the required ClickApp is enabled. |
| Workspace organization | Read hierarchy and create or update spaces-related folders and lists. |
| People and assignment | List members, find members, and resolve names, email addresses, usernames, or `me` to ClickUp user IDs. |
| Chat | List channels, read messages and replies, and send channel or threaded messages. |
| Reminders | Create, search, update, and complete personal reminders. |
| Custom fields | Discover workspace, space, folder, or list custom-field definitions and valid options. |
| Documents | Create documents, list pages, read page content, create pages, and replace page content. |

Potentially destructive actions—such as deleting or merging tasks—or externally visible actions—such as posting comments and chat messages—should be performed only after the intended target and change are explicitly confirmed.

## How to Use It

You can ask in ordinary language. Because this account has multiple workspaces, include the workspace name or ID whenever practical. For task creation, specify the destination list rather than leaving it ambiguous.

| Goal | Example request |
|---|---|
| Find work | “In Apartment Corp Workspace, show active tasks updated this week.” |
| Inspect one task | “Get task `86b8zecf8`, including its description and custom fields.” |
| Create a task | “Create ‘Inspect roof’ in the Projects list, assign it to me, and set the due date to Friday.” |
| Update a task | “Change task `ABC-123` to In Progress and set priority to High.” |
| Collaborate | “Post this comment on task `ABC-123`: ‘Vendor confirmed the appointment.’” |
| Track time | “Start a billable timer on task `ABC-123` with description ‘Site review.’” |
| Search broadly | “Search ClickUp documents, tasks, and chats for ‘lease renewal’.” |
| Set a reminder | “Remind me tomorrow at 9:00 AM to review the vacancy report.” |

## Practical Notes

The connector automatically resolves many human-friendly references, including list names and assignees, but filters sometimes require numeric IDs. When that happens, it can first resolve a name or email address. Search results are paginated, and hierarchy requests can be limited by depth to avoid unnecessarily retrieving large workspace structures.

[1]: https://app.clickup.com/t/86b8zecf8 "Vacancy Report App task in ClickUp"
