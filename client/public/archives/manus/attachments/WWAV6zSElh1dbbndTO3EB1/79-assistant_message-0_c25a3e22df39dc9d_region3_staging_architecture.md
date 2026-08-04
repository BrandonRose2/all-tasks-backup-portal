# PropertyMax Region 3 ClickUp Staging Architecture

**Prepared by:** Manus AI  
**Prepared for:** Brandon Rose  
**Target Workspace:** `90141135992`  
**Status:** Proposal only — no ClickUp changes authorized  
**Date:** July 14, 2026

## 1. Purpose and Verified Scope

This proposal defines a native ClickUp pilot for **all Region 3 properties**. The authoritative Notion source identifies **11 properties**, Ginger Positerry as Regional Manager, and 15 additional unique named site contacts. The ClickUp Workspace currently has only four members: Marc Menowitz, Brandon Rose, Ethan Cowles, and Robert.[1] [2] [3]

The staging environment will remain isolated from existing operational Spaces. No invitations, permissions, tasks, Forms, Dashboards, or automations will be activated until Brandon approves the architecture and resolves the roster exceptions documented below.

## 2. Architecture Decision

Two viable native ClickUp structures are available. The choice primarily depends on whether **property-level access isolation** is more important than minimizing the number of Folders and Lists.

| Approach | Tradeoffs | Cost | Setup Complexity |
|---|---|---|---|
| **Option A — Property-Isolated Folders** | Gives each property team access only to its own Folder while Ginger and the core team can oversee all properties. It produces more Folders, Lists, Forms, and assignment rules, but permission boundaries are clear and auditable. | Uses the existing ClickUp subscription; additional member or guest licensing may apply depending on the approved access type and current plan. | High initial setup; low operational ambiguity. |
| **Option B — Central Functional Workflows** | Uses a small number of shared Lists with a Property field and saved filtered views. It is faster to build and easier to standardize, but property-level visibility depends on filters rather than strong location boundaries. | Uses the existing ClickUp subscription; licensing considerations remain the same. | Moderate initial setup; higher permission and filtering risk. |

> **Approval required:** Choose **Option A** or **Option B**. No structure will be created until Brandon selects one.

## 3. Option A — Property-Isolated Folders

The proposed Space name is **`STAGING — PropertyMax Region 3 Pilot`**. The `STAGING` prefix keeps the environment visibly separate from production operations.

### Space Hierarchy

| Folder | Lists | Intended access |
|---|---|---|
| `00 — Pilot Control Center` | Decisions & Change Requests; Pilot Issues & QA; Contacts & Access | Brandon, Marc, Robert, and Ethan |
| `01 — Regional Oversight` | Regional Escalations; Cross-Property Initiatives; Vendor & Capital Review | Core team and Ginger |
| `P01 — Bayou Pointe` | Requests & Work Orders; Turns & Vacancies; Inspections & Compliance | Core team, Ginger, Jennifer Frederick |
| `P02 — Howell Place` | Same three standard Lists | Core team, Ginger, Sandra Crump |
| `P03 — Marrero 3` | Same three standard Lists | Core team, Ginger, Ketorah Parks, Cierra Pritchett, Asjia Carter |
| `P04 — North Pointe` | Same three standard Lists | Core team, Ginger, Jennifer Frederick |
| `P05 — Pelican Bay` | Same three standard Lists | Core team, Ginger, Dequanta Sutherland, Valencia Patterson |
| `P06 — Pirates Bend` | Same three standard Lists | Core team, Ginger, Sandra Crump |
| `P07 — Ruby Diamond / Star Homes` | Same three standard Lists | Core team, Ginger, manager and assistant after names are confirmed |
| `P08 — St. Charles Place` | Same three standard Lists | Core team, Ginger, Deon Tolliver, Crystal Harmon |
| `P09 — The Gates on Manhattan` | Same three standard Lists | Core team, Ginger, Lindgret Celestine, Arlene Lantigua, Natasha Almond; reception after confirmation |
| `P10 — Thibodaux - Colonial Estates Apts` | Same three standard Lists | Core team, Ginger, Susie Rogers |
| `P11 — Yorkshire / Windsor Village` | Same three standard Lists | Core team, Ginger, Kimberly Powell, Kristina Marshall |

This structure creates **13 Folders and 37 Lists**: four governance and regional Lists plus three standard operational Lists for each of the 11 properties.

## 4. Option B — Central Functional Workflows

Option B uses the same proposed staging Space but consolidates records by operational process.

| Folder | Lists | Primary segmentation |
|---|---|---|
| `00 — Pilot Control Center` | Decisions & Change Requests; Pilot Issues & QA; Contacts & Access | Governance role |
| `10 — Operations Intake` | Requests & Work Orders; Resident / Site Escalations | Property field and assignee |
| `20 — Turns & Vacancy` | Unit Turns; Market-Ready Review | Property field and due date |
| `30 — Inspections & Compliance` | Inspection Schedule; Findings & Corrective Actions | Property field and compliance type |
| `40 — Regional Oversight` | Cross-Property Initiatives; Vendor & Capital Review | Region, property, and approver |

Option B creates **5 Folders and 11 Lists**. It should be selected only if all site contacts may safely access shared Region 3 workflows or if ClickUp's approved access model can reliably restrict records beyond saved filters.

## 5. Standard Workflows

Each operational List will use a purpose-built status sequence rather than one universal workflow.

| Workflow | Status sequence |
|---|---|
| Requests & Work Orders | New → Triaged → Assigned → In Progress → Waiting on Vendor / Resident → Ready for Review → Closed; with Cancelled as an exception |
| Turns & Vacancies | Notice Received → Pre-Walk → Scope Approved → Scheduled → In Progress → Quality Check → Market Ready → Closed |
| Inspections & Compliance | Scheduled → Inspection In Progress → Findings Logged → Correction In Progress → Reinspection → Passed → Closed |
| Regional Escalations | Open → Reviewing → Action Plan Approved → In Progress → Monitoring → Resolved |
| Pilot Issues & QA | Reported → Reproduced → Fix Planned → In Progress → Retest → Verified → Closed |

## 6. Custom Field System

The field system combines built-in ClickUp fields with controlled custom fields. Folder-level or Space-level fields should be used where possible so reporting remains consistent.

| Field | Type | Purpose |
|---|---|---|
| Region | Dropdown | Default to Region 3; preserves future scale |
| Property | Dropdown | One of the 11 verified Region 3 properties |
| Request Type | Dropdown | Maintenance, Turn, Inspection, Compliance, Resident Escalation, Vendor, Capital, Administrative |
| Unit / Area | Text | Unit number, building, common area, or site location |
| Safety / Emergency | Checkbox | Triggers urgent review |
| Resident Impact | Dropdown | None, Low, Medium, High |
| Work Category | Dropdown | Plumbing, Electrical, HVAC, Structural, Grounds, Life Safety, Security, Cleaning, Other |
| Source | Dropdown | Internal Form, Manual Entry, Inspection, Resident Report, Vendor, Leadership |
| Property Manager | People | Named property lead after Workspace access exists |
| Assistant / Coordinator | People | Assigned property support after Workspace access exists |
| Regional Manager | People | Ginger after Workspace access exists |
| Vendor | Text or Relationship | Vendor responsible for external work |
| Estimated Cost | Currency | Expected cost |
| Approved Cost | Currency | Approved commitment |
| Approval Required | Checkbox | Routes financial or policy review |
| SLA Target | Date | Service expectation separate from final due date |
| Resolution Summary | Long Text | Required closeout narrative |

## 7. Task Naming and Templates

Tasks will follow the naming convention **`R3 | Property | Type | Unit/Area | Short issue`**. This makes searches, notifications, and dashboard cards understandable without opening each task.

| Template | Minimum contents |
|---|---|
| Maintenance / Site Work Order | Problem statement, location, photos, access notes, safety impact, assignees, due date, cost fields |
| Emergency / Life-Safety Incident | Immediate condition, people affected, emergency services contacted, containment steps, Ginger review, time-stamped updates |
| Unit Turn | Move-out date, pre-walk checklist, scope, vendor assignments, target market-ready date, quality-control checklist |
| Inspection Finding | Inspection type, finding, evidence, regulatory or policy reference, correction owner, reinspection date |
| Vendor Quote / Approval | Scope, quotes, selected vendor, estimated and approved cost, approval record, schedule |
| Resident / Site Escalation | Issue summary, contact history, requested outcome, risk level, owner, next update date |

## 8. Forms

The staging build should use ClickUp Forms that create tasks in controlled intake Lists. Forms will include a notice instructing users not to enter unnecessary resident personally identifiable information.

| Form | Destination | Key behavior |
|---|---|---|
| Property Operations Request | Requests & Work Orders | Captures property, unit/area, issue type, impact, photos, and urgency |
| Unit Turn Kickoff | Turns & Vacancies | Captures notice date, unit, pre-walk date, scope, and target completion |
| Inspection Finding | Inspections & Compliance | Captures inspection type, finding, evidence, severity, and correction target |
| Pilot Issue / Feedback | Pilot Issues & QA | Captures usability issues, missing fields, workflow defects, and improvement requests |

With Option A, each property can receive a pre-scoped Form tied to its Folder's destination List. With Option B, shared Forms must require the Property field and rely on assignment rules.

## 9. Dashboards

| Dashboard | Audience | Core measures |
|---|---|---|
| Region 3 Command Center | Brandon, Marc, Robert, Ethan, Ginger | Open work by property and type; overdue items; urgent issues; work aging; turns to market-ready; inspection closure rate; estimated versus approved cost |
| Property Operations Dashboard | Ginger and each property's approved team | Current backlog, due this week, blocked work, active turns, inspection findings, recent closures |
| Pilot Health Dashboard | Core team | Adoption by property, tasks created, completion rate, overdue rate, missing required fields, QA issues, automation exceptions |

Dashboard filters must default to the staging Space so existing production work is not mixed into pilot metrics.

## 10. Proposed Automations

Automations should be activated in two stages: first with notifications suppressed where possible for testing, then enabled after the core team validates assignment and escalation behavior.

| Trigger | Action | Safeguard |
|---|---|---|
| Form creates a task | Set status to New; apply Source; assign the approved property team | Test once per property before broad use |
| Safety / Emergency becomes checked | Set urgent priority; assign Ginger and the property lead; set immediate SLA target | Do not activate until Ginger has access and accepts the escalation role |
| Property field is selected | Assign the mapped property manager and assistant | Requires one tested mapping per property |
| Status changes to Ready for Review or Quality Check | Assign Ginger or the designated reviewer | Avoid duplicate assignments when a reviewer is already present |
| Task becomes overdue | Add an escalation flag and surface it on the Region 3 Dashboard | Do not send external messages during staging |
| Approval Required becomes checked | Move or add the task to Vendor & Capital Review | Confirm Tasks in Multiple Lists is enabled before using add-to-list behavior |
| Status changes to Closed | Prompt for Resolution Summary and final cost; update reporting fields | Use a QA check if ClickUp cannot enforce field completion natively |

## 11. Permission Model

| Role | Proposed access |
|---|---|
| Brandon | Space owner / administrator for the pilot |
| Marc, Robert, Ethan | Full staging Space access; governance and QA responsibilities to be assigned after approval |
| Ginger | Edit access to Regional Oversight and all 11 property workflows |
| Named property site contacts | Edit access only to their assigned property Folder under Option A; scoped shared workflow access under Option B |
| Unnamed role records | No access until a person and verified email are supplied |

Member-versus-guest access must be reviewed before invitations because it may affect permissions and licensing. Invitations will be a separate approval step after the staging structure is built and tested by the four existing Workspace members.

## 12. Data Quality Gates

The following issues must be resolved before all property teams can be invited:

| Gate | Current issue |
|---|---|
| Ruby Diamond / Star Homes manager | Name missing; email listed as `rubystarmanager@apartmentcorp.com` |
| Marrero 3 manager | Ketorah Parks is listed with the same `rubystarmanager@apartmentcorp.com` address, creating a possible cross-property or data-quality ambiguity |
| Ruby Diamond / Star Homes assistant | Name missing; email listed as `rubystarasst@apartmentcorp.com` |
| The Gates reception | Name and email both missing |
| Shared responsibility | Jennifer Frederick covers Bayou Pointe and North Pointe; Sandra Crump covers Howell Place and Pirates Bend; these dual assignments should be confirmed |

## 13. Controlled Build and Test Sequence

| Stage | Work performed | Approval gate |
|---|---|---|
| 1. Structure | Create the selected Space hierarchy and governance Lists | Brandon approves Option A or B and the names |
| 2. Configuration | Configure statuses, fields, views, and templates | Core team validates one representative property |
| 3. Forms and Dashboards | Create intake Forms and staging-only dashboards | Submit test records only; verify routing and reporting |
| 4. Automations | Enable rules one at a time | Record expected versus actual behavior |
| 5. Access | Invite or grant access to Ginger and site contacts | Brandon approves member/guest levels and resolves missing names |
| 6. Pilot Launch | Activate all Region 3 properties | Core team signs off on QA checklist and communication plan |

## 14. Approval Requested

Before any ClickUp creation begins, Brandon should provide four decisions: **Option A or Option B**, whether Marc/Robert/Ethan should all have full staging access, whether Ginger should have edit access across every property, and whether invitations should wait until the four existing members complete internal testing.

## References

[1]: https://app.notion.com/p/afebeda7e3b54186a6eb9eb20b57048f "Company Contacts 5.11.26"
[2]: https://app.notion.com/p/dbea06080450452e977cf380b120f26b "Managers & Assistants: Contact List (Updated 2026-05-11)"
[3]: https://app.clickup.com/90141135992 "PropertyMax ClickUp Workspace 90141135992"
