# ClickUp Access Verification Findings

**Verified:** July 14, 2026

The ClickUp connector is enabled. Read-only hierarchy discovery shows that the authenticated account can access three ClickUp Workspaces:

The connector resolves the currently authenticated ClickUp user as user ID **`198294202`** in Workspace `90141135992`.

| Workspace ID | Verified top-level Spaces | Space count |
|---|---|---:|
| `90141033101` | **Apartment Corp Workspace** | 1 |
| `90141034985` | **Team Space** | 1 |
| `90141135992` | **Team Space**; **Vacancy Report Webapp**; **Manager's Contact List**; **PropertyMax.ai** | 4 |

Workspace `90141135992` is the only accessible Workspace whose top-level hierarchy explicitly includes a **PropertyMax.ai** Space. This is a strong identification signal, but the production Workspace and staging location still require Brandon's confirmation before any deeper inspection or setup work.

No ClickUp records have been created, edited, deleted, moved, assigned, or messaged during verification.
