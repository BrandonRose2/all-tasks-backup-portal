# PropertyMax.ai × ClickUp Operating Ecosystem Blueprint

**Prepared for ApartmentCorp / PropertyMax.ai**  
**Prepared by Manus AI**  
**Date: July 14, 2026**

## Executive summary

PropertyMax.ai should remain the **portfolio entry point and source-system gateway**, while ClickUp becomes the **system of coordination and accountability**. This distinction prevents the team from duplicating OneSite ledgers, AppWork work orders, Paychex records, inspection evidence, and full Operations Hub analytics. ClickUp should receive only work that requires a decision, owner, due date, escalation, cross-functional dependency, or verified closure.

The proposed model uses one ClickUp Workspace named **ApartmentCorp Operations**, nine operational and governance Spaces, a controlled master-data layer, custom task types for real operating records, and Relationships that join properties, units, vacancies, turns, work-order exceptions, inspections, findings, help requests, and people assignments. ClickUp’s documented hierarchy, custom fields, relationships, forms, dashboards, automations, and webhooks support this architecture, although availability and limits vary by ClickUp plan.[2] [3] [4] [5] [6] [7] [8]

> **Core operating rule:** A routine source record stays in its source system. A ClickUp task is created only when a person must acknowledge, decide, coordinate, remediate, verify, or escalate something.

![PropertyMax and ClickUp ecosystem architecture](https://files.manuscdn.com/user_upload_by_module/session_file/310519663449376037/aNnRZEnpQQiiNxfS.png)

## 1. What was reviewed

The design is based on a user-authorized review of the authenticated PropertyMax.ai application, the public REST API documentation, and every green navigation tab visible at the top of the application on July 14, 2026.[1] The review covered **AppWork–Admin, Help, Hub, Vacancy, AppWork, Inspections, OneSite, and Paychex**. The public REST documentation exposed a users endpoint but did not expose documented vacancy, work-order, call, guest-card, delinquency, or inspection resources at the time of review.[1]

| Green tab | Observed destination or operating purpose | ClickUp responsibility | System-of-record boundary |
|---|---|---|---|
| AppWork–Admin | MyLoneWorkers patrol, lone-worker, checkpoint, alert, and safety administration | Coordinate patrol exceptions, safety follow-up, and manager acknowledgement | Detailed safety telemetry and evidence remain in MyLoneWorkers |
| Help | PropertyMax help and training request intake | Create Help Requests, route regional review, manage SLAs, schedule training, and identify knowledge candidates | Original attachment or sensitive support evidence remains in the approved source |
| Hub | Portfolio KPIs, calls, guest cards, collections, reports, and manager performance | Create KPI Exceptions and recurring regional reviews only when thresholds require action | The Hub remains the analytics and report source |
| Vacancy | Unit notice, eviction, move-out, readiness, prelease, and move-in lifecycle | Coordinate the Vacancy Case, Turn Workstream, leasing dependencies, and move-in gates | Vacancy state and approved milestone fields remain authoritative in PropertyMax |
| AppWork | Maintenance work orders, assignment, vendors, execution, and completion evidence | Receive emergency, overdue, blocked, high-cost, repeat, or vacancy-blocking exceptions | AppWork remains the work-order system of record |
| Inspections | Inspection scheduling, submission, deficiencies, evidence, and reinspection | Coordinate Inspections, Findings, remediation ownership, and closure gates | Full inspection evidence remains in the inspection source |
| OneSite | Resident, applicant, lease, ledger, compliance, and property-management data | Coordinate limited-reference resident, collections, legal, and recertification exceptions | OneSite remains authoritative; full ledgers and resident documents are not copied |
| Paychex | Payroll, time, employee, benefits, and HR administration | Coordinate onboarding, transfers, offboarding, training, access review, and staffing exceptions | Payroll, compensation, tax, bank, SSN, benefit, and medical data remain in Paychex |

## 2. Target operating model

The ecosystem has three layers. **Source systems** hold authoritative records and detailed evidence. **ClickUp** converts selected exceptions and commitments into owned work. **Management review** uses filtered queues and dashboards to make decisions and confirm closure. This is not a wholesale migration of PropertyMax into ClickUp; it is a controlled coordination overlay.

| Layer | Purpose | Examples | Success test |
|---|---|---|---|
| Source and transaction layer | Maintain authoritative business records and execute specialist work | PropertyMax, Vacancy, Hub, AppWork, MyLoneWorkers, OneSite, Paychex | Data is current in the correct source and no unnecessary duplication exists |
| Coordination layer | Assign accountability, due dates, dependencies, risk, and cross-team decisions | Vacancy Case, Turn Workstream, Finding, Work Order Exception, Help Request | Every actionable exception has one accountable owner and next review date |
| Management layer | Prioritize risk, compare regions, review commitments, and escalate | Manager Attention Queue, Regional Review, Executive Scorecard | Decisions and recovery plans are documented; overdue work is visible before failure |
| Governance layer | Control taxonomy, permissions, integration quality, and change | Field Dictionary, Automation Catalog, Sync Failure Queue, Change Control | Duplicates, privacy violations, orphaned tasks, and uncontrolled automations are detected |

## 3. ClickUp Workspace hierarchy

ClickUp documents a hierarchy of Workspace, Space, optional Folder/Subfolder, List, Task, and Subtask, with permissions applied at relevant locations.[2] The recommended structure uses one Workspace for ApartmentCorp, Spaces for durable operating domains, Folders for regions or process families, and Lists for queues that share one lifecycle.

```text
ApartmentCorp Operations
├── 00 Portfolio Command Center
│   ├── Daily Operations: Portfolio Exceptions, Manager Attention, Daily Report Runs
│   ├── Performance Management: Property Scorecards, Regional Reviews, Executive Initiatives
│   └── Controlled Documents: Reporting Calendar, Hub/SharePoint/External Reports
├── 01 Leasing, Vacancy & Turns
│   ├── Region 1–4: Notice & Eviction, Vacant–Unleased, Vacant–Preleased, Move-In Readiness
│   └── Portfolio Leasing: Prospect Exceptions, Marketing Call Follow-Up, Rent/Pricing Actions
├── 02 Maintenance & Facilities
│   ├── Region 1–4: Reactive Exceptions, Vacancy Turns, Preventive Maintenance, Vendor Work
│   └── Portfolio Maintenance: Repeat Failures, Capital/Large Repairs, AppWork Sync Exceptions
├── 03 Safety, Inspections & Compliance
│   ├── Inspections: Section 8/HQS, NSPIRE, Property, Reinspection Queue
│   ├── Findings & Remediation: Open Findings, Evidence Review
│   └── Lone-Worker Safety: Patrol Exceptions, Safety Incidents
├── 04 Resident & Financial Operations [Private]
│   ├── Collections: Delinquency Exceptions, Payment Commitments, Legal Escalations
│   ├── Resident Administration: Recertification, Lease/Legal, Privacy/Security Cases
│   └── OneSite Sync: Action Queue, Integration Errors
├── 05 Shared Services
│   ├── Help Desk & Training: New, In Progress/Scheduled, Resolved Knowledge Candidates
│   ├── Operations Requests: PropertyMax, Process Improvement, Special Projects
│   └── Knowledge Base: SOP Review, Training Content Backlog
├── 06 People Operations [Private]
│   ├── Employee Lifecycle: Onboarding, Role/Property Changes, Offboarding
│   ├── Learning & Credentials: Required Training, Renewals, Manager Coaching
│   └── Staffing: Staffing Requests, Time & Attendance Exceptions
├── 07 Master Data & Relationships [Restricted]
│   └── Properties, Units, People & Roles, Vendors, Systems, Metric Definitions
└── 99 Workspace Governance [Private]
    ├── Templates & Standards: Task Templates, Field Dictionary, Automation Catalog
    ├── Data Quality: Sync Failures, Duplicate/Missing References, Audit Reviews
    └── Change Control: Workspace Changes, Release Notes
```

## 4. Core record model

Custom task types prevent every item from becoming a generic task. ClickUp custom fields can be scoped to hierarchy locations and task types, and they support filtering, formulas, permissions, reporting, and automation use subject to plan availability.[4] Relationships can connect tasks and expose fields from related records, while access remains controlled by the underlying item’s permissions.[3]

| Task type | Canonical name | System relationship | Primary owner | Closure condition |
|---|---|---|---|---|
| Property | `PROPERTY · {Property Name}` | Master property reference | Data steward | Active ownership and source identifiers verified |
| Unit | `UNIT · {Property} · {Unit}` | Child of Property | Data steward | Unit reference reconciled with source |
| KPI Exception | `EXCEPTION · {Metric} · {Property} · {Date}` | Operations Hub snapshot | Regional or functional manager | Decision executed and metric/source rechecked |
| Vacancy Case | `VAC · {Property} · {Unit} · {Stage}` | PropertyMax Vacancy | Property manager | Source shows occupied/corrected and linked blockers are closed |
| Turn Workstream | `TURN · {Property} · {Unit} · Target {Date}` | Vacancy Case and AppWork | Maintenance supervisor | QC passed and Vacancy readiness gate satisfied |
| Work Order Exception | `WO · {Property} · {Unit} · {Reason}` | AppWork work order | Maintenance supervisor | Source status verified and exception reason resolved |
| Inspection | `INSP · {Program} · {Property} · {Unit} · {Date}` | Inspection source | Inspector/compliance | Passed or approved cancellation with findings resolved |
| Finding | `FINDING · {Severity} · {Property} · {Unit}` | Parent Inspection and corrective work | Remediation owner | Evidence reviewed and closure/reinspection verified |
| Help Request | `HELP · {Category} · {Property} · {Requester}` | Help form | Regional/functional owner | Requester outcome confirmed and resolution coded |
| Resident/Financial Exception | `RES/FIN · {Process} · {Property} · {Reference}` | OneSite secure reference | Property/accounting/compliance | Source action and approved outcome verified |
| Employee Lifecycle Case | `PEOPLE · {Process} · {Employee Ref} · {Date}` | Paychex secure reference | HR/supervisor | Access, training, assignment, and handoff checks complete |
| Integration Error | `SYNC · {System} · {Object} · {Timestamp}` | Integration adapter | ClickUp administrator/data steward | Corrected and idempotently reprocessed or formally accepted |

### Shared fields

The minimum workspace-wide field set should remain deliberately small. Process-specific fields belong only where they are operationally meaningful.

| Field | Type | Purpose and rule |
|---|---|---|
| Source System | Dropdown | Required for synchronized or source-linked work |
| Source Object ID | Text | Stable source identifier; never use a display name as the sole key |
| Source URL | URL | Secure deep link to the system of record |
| Region | Dropdown | Region 1–4 or Corporate; drives views and routing |
| Property / Unit | Relationship | Joins operational work to master records |
| Responsible Manager | People | Single accountable operating owner |
| Executive Risk | Dropdown | Green, Watch, At Risk, Critical; reserved for decision priority |
| Data Classification | Dropdown | Public, Internal, Confidential, Restricted |
| Last Source Sync | Date/time | Communicates data freshness |
| Integration Health | Dropdown | Current, Delayed, Error, Manual |
| Idempotency Key | Text | Prevents duplicate creation during retries and replays |

## 5. Priority workflow: vacancy to move-in

The vacancy workflow should be the first operational pilot because it crosses property management, leasing, maintenance, inspections, legal milestones, and executive risk. One **Vacancy Case** coordinates the lifecycle; linked workstreams hold maintenance and compliance execution. PropertyMax remains authoritative for the approved stage and dates.

![Vacancy-to-move-in control loop](https://files.manuscdn.com/user_upload_by_module/session_file/310519663449376037/dfYRHPuHFPlyAmBL.png)

| Stage | ClickUp work | Default owner | Required decision or evidence | Exit gate |
|---|---|---|---|---|
| Notice or legal state | Upsert Vacancy Case and validate milestone dates | Property manager | Confirm notice, court, possession, or planned move-out facts | Dates and responsibility verified |
| Vacated | Create linked Turn Workstream and scope inspection | Maintenance supervisor | Scope, target-ready date, source links | Approved plan exists |
| Turn underway | Monitor only AppWork exceptions and cross-team blockers | Maintenance supervisor | Vendor, parts, approval, access, or life-safety decision | Blocking exceptions resolved |
| Quality control | Complete QC inspection and create Findings if needed | Property manager/inspector | Evidence and remediation review | No unresolved critical findings |
| Leasing/prelease | Track applicant milestone without sensitive screening data | Leasing/property team | Move-in date, approved milestone, next action | Move-in gate is documented |
| Move-in readiness | Confirm unit, keys, utilities, inspection, and operational checks | Property manager | Every mandatory dependency complete | Ready and documents confirmed in source |
| Closure | Reconcile source stage and linked records | Property manager; regional review after breach | Outcome and root cause | Occupied/corrected in source; blockers closed |

> **Illustrative—not policy:** Suggested acknowledgement and readiness thresholds in this blueprint must be approved by ApartmentCorp before production. The mock-up’s counts, property names, priorities, and chart values are sample interface data, not reported portfolio results.

## 6. Other end-to-end workflows

| Workflow | Entry trigger | ClickUp coordination | Escalation | Closure control |
|---|---|---|---|---|
| Maintenance exception | Emergency, overdue, blocked, high-cost, repeat, or vacancy-blocking work order | Create Work Order Exception linked to AppWork and relevant Vacancy/Inspection | P1 immediately; other thresholds by approved SLA | AppWork state is rechecked; closing ClickUp does not close the source work order |
| Inspection to remediation | Scheduled inspection or failed item | Inspection parent, one Finding per deficiency, corrective source work, evidence review | Life-safety finding becomes P1; overdue findings enter regional review | Parent cannot pass with open critical findings |
| Collections exception | Risk/aging threshold, missed payment commitment, or legal escalation | Limited reference, next action, due date, commitment monitoring | Approved accounting/legal chain | OneSite state reconciled; sensitive ledger data remains outside ClickUp |
| Help and training | ClickUp Form or existing Help submission | Regional review, category routing, SLA, training scheduling, resolution code | Missed response/resolution due dates | Requester outcome confirmed; repeated issue becomes knowledge candidate |
| Portfolio exception | Hub metric crosses a human-action threshold | KPI Exception and linked recovery plan | Regional then executive based on duration/severity | Source metric is rechecked and decision outcome recorded |
| Employee lifecycle | Approved onboarding, transfer, role change, or offboarding event | Access, assignment, training, equipment, and task-handoff checklist | Supervisor/HR/operations based on overdue gate | Paychex/reference state and access review confirmed |
| Integration failure | Mapping, authentication, permission, validation, or transport failure | Retry, owner assignment, correction, replay, and audit trail | Business-impact SLA | Idempotent replay succeeds or exception is approved with expiration |

## 7. Task templates and examples

The examples below demonstrate the expected level of clarity. Production values should come from approved PropertyMax and source-system data.

| Template | Example task name | Required fields | Standard subtasks |
|---|---|---|---|
| Vacancy Case | `VAC · Sample Gardens · 2B · Vacated` | Source IDs/URL, region, property, unit, manager, stage, move-out, target-ready, preleased, target move-in, readiness, risk | Validate dates; create turn scope; monitor readiness; confirm leasing milestone; QC; move-in readiness; verify source closure |
| Turn Workstream | `TURN · Sample Gardens · 2B · Target Aug 15` | Vacancy relationship, target-ready, technician/vendor, blocker, cost, AppWork IDs | Initial inspection; estimate; approval; make-ready; paint; flooring; cleaning; locks; safety devices; appliances; QC |
| Work Order Exception | `WO · Sample Gardens · 2B · Parts Blocker` | AppWork ID, category, severity, owner, blocker, source URL, related Vacancy | Confirm impact; vendor/parts decision; revised completion; source update; verification |
| Finding | `FINDING · Urgent · Sample Gardens · 2B` | Inspection relationship, severity, due date, owner, evidence requirement | Protect occupant/worker; create repair; complete correction; submit evidence; reviewer verification; reinspect |
| Help Request | `HELP · Vacancy Update · Region 2 · Requester` | Requester/role, property/region, category, impact, priority, training preference, SLA dates | Validate; route; reproduce/clarify; resolve or train; requester confirmation; knowledge review |
| Regional Review | `REVIEW · Region 2 · Week of Aug 17` | Region, chair, review date, open critical relationships | Prior commitments; vacancy risk; maintenance/inspection blockers; collections; calls/leads; staffing/training; decisions |

### Example Vacancy Case description

```text
PURPOSE
Coordinate this unit from notice/legal state through turn, leasing, move-in,
and verified source-system closure.

CURRENT SOURCE SUMMARY
Source state:
Last synchronized:
Key milestone:
Current blocker:

OPERATING DECISION
Recovery plan:
Next owner action:
Next review date:

PRIVACY
Do not paste applicant/resident identity, screening, banking, SSN, medical,
or full ledger data. Use the restricted source link.
```

## 8. Automation catalog

ClickUp automations can react to custom-field changes or dates, use fields as conditions, and set fields or create work, subject to plan limits.[6] Automation webhooks can send controlled HTTPS payloads, while API webhooks support broader task events; webhook processing should validate signatures and use stable event identifiers for idempotency.[7] [8]

| ID | Trigger | Conditions | Action | Outcome |
|---|---|---|---|---|
| A-001 | Help form submitted | Required fields present | Apply template, set Ticket Received, assign regional manager, calculate SLA | Structured intake without manual triage |
| A-002 | Priority becomes P1 | Task open | Set Critical, notify owner and regional manager, apply urgent due date | Life-safety/emergency visibility |
| A-003 | First Response Due arrives | Not acknowledged/resolved | Notify assignee and record SLA breach | Timely acknowledgement |
| A-004 | Resolution Due arrives | Task open | Set At Risk and add to Manager Attention Queue | Management intervention before silent aging |
| A-005 | Vacancy becomes Vacated | No linked Turn Workstream | Create Turn template, relate it, assign supervisor | Automatic cross-functional handoff |
| A-006 | Preleased becomes true | Target move-in exists | Generate move-in readiness checklist and notify property/maintenance | Protect promised move-in date |
| A-007 | Move-in approaches | Readiness below approved threshold | Set Critical and escalate | Early recovery decision |
| A-008 | Turn blocker changes | Vendor, parts, approval, or access | Assign/notify correct resolver and add review date | Blocker ownership |
| A-009 | Inspection opens findings | Finding count above zero | Validate assignments; create regional exception for critical items | No orphaned deficiency |
| A-010 | Evidence Complete becomes true | Finding in progress | Move to Evidence Review and assign reviewer | Separation of execution and verification |
| A-011 | All findings verified closed | Inspection not passed | Move parent to reinspection/pass review | Controlled parent closure |
| A-012 | Help request resolves | Knowledge Candidate checked | Create linked SOP/training content task | Continuous improvement |
| A-013 | Source identifier changes | Synced record | Recalculate idempotency key and flag duplicates | Data integrity |
| A-014 | Integration Health becomes Error | Retry limit not reached | Upsert Integration Error and request bounded retry | Managed recoverability |
| A-015 | Retry limit reached | Still in error | Assign administrator and system owner | Human intervention |
| A-016 | Person/role becomes inactive | Open assigned work exists | Create reassignment review | No orphaned accountability |
| A-017 | Weekly schedule | Region active | Create Regional Review and relate open critical exceptions | Consistent management cadence |
| A-018 | Monthly schedule | Property active | Create Property Scorecard review | Comparable performance review |
| A-019 | Work-order exception marked resolved | Source not verified | Prevent final close and create verification subtask | Source truth preserved |
| A-020 | Classification becomes Restricted | Guest access exists | Notify admin and remove unapproved guest access | Privacy control |

## 9. Dashboard ecosystem

ClickUp Dashboards support cards, filters, drill-down, sharing, scheduled reports, PDF export, and configurable auto-refresh, subject to plan and card limits.[5] Dashboards should visualize **exceptions, commitments, aging, and system health**, not mirror every source-system report.

| Dashboard | Audience | Core filters | Recommended cards and measures | Decision enabled |
|---|---|---|---|---|
| Portfolio Executive Scorecard | Owners, executives, COO | Period, region, property, source | Critical exceptions by family; overdue commitments; vacancy risk; preleased at risk; open life-safety findings; SLA trend; integration health | Where leadership attention or resources are required |
| Regional Performance & Risk | Regional manager | Region, manager, property | Manager queue; aging by property; vacancy days/readiness; overdue maintenance exceptions; inspection findings; collections commitments; help SLA | Which property needs intervention and what decision is due |
| Property Daily Command Center | Property manager | Property, today/7 days | My due work; move-in readiness; open vacancy/turn blockers; urgent work-order exceptions; inspections due; resident commitments | Today’s operating sequence |
| Vacancy & Turn Control Tower | Property, maintenance, leasing | Region, property, stage, preleased, move-in window | Stage funnel; days vacant distribution; target-ready variance; blocker family; readiness vs move-in; turn owner workload | Which unit will miss readiness or move-in and why |
| Maintenance Control Tower | Maintenance leadership | Region, property, severity, category | P1/P2 open; overdue exceptions; repeat issues; vendor/parts blockers; high-cost approvals; vacancy-blocking work | Dispatch, vendor, approval, and escalation priorities |
| Compliance & Inspection Risk | Compliance and regional leadership | Program, region, severity | Inspections due/overdue; open findings by severity; evidence awaiting review; reinspection risk; closure aging | Which compliance deadline or life-safety item needs action |
| Collections & Cash Risk | Accounting and approved managers | Region, aging, commitment state | Amount at risk from source summary; missed commitments; legal-review queue; resolution trend | Collection strategy and escalation |
| Help & Training Operations | Shared services, regional managers | Category, region, SLA, requester role | New/routed/awaiting; response and resolution SLA; repeated categories; training demand; knowledge candidates | Staffing, routing, and training response |
| People Operations | HR and supervisors | Region, process, effective date | Onboarding due; access/training gaps; transfers; offboarding risk; staffing requests | Readiness and access decisions |
| Integration & Data Quality | ClickUp administrator, operations sponsor | System, health, error class | Sync freshness; retries; failures by system; duplicates; missing relationships; accepted exceptions expiring | Integration recovery and governance priority |

### Dashboard filter standard

Every operational dashboard should expose **Region, Property, Responsible Manager, Source System, Executive Risk, Status, Due Date window, and Data Freshness** where applicable. Restricted dashboards must not expose resident, legal, payroll, or employee-sensitive data to unauthorized users.

## 10. Views by role

| Role | Default view | Secondary view | What is deliberately hidden |
|---|---|---|---|
| Property Manager | Property Daily Command Center | Vacancy/Turn board and calendar | Other regions and restricted HR/legal details |
| Regional Manager | Regional Performance & Risk | Manager Attention Queue grouped by property | Unnecessary resident/payroll detail |
| Maintenance Technician | My Maintenance Queue | Mobile schedule/checklist | Portfolio financial and HR records |
| Maintenance Supervisor | Maintenance Control Tower | Vacancy-blocking work and vendor queue | Resident ledgers and payroll |
| Leasing/Office | Leasing Pipeline | Move-In Readiness | Sensitive screening or financial details not needed for coordination |
| Inspector/Compliance | Compliance & Inspection Risk | Evidence Review | Unrelated resident and HR data |
| Accounting | Collections & Cash Risk | Commitments and legal-review queue | Maintenance and HR detail beyond relationships |
| HR/Payroll | People Operations | Access and training readiness | Resident and property financial detail |
| Executive | Portfolio Executive Scorecard | Regional drill-down | Task-level sensitive narrative unless explicitly authorized |
| ClickUp Administrator | Integration & Data Quality | Governance queues | Source-system secrets and protected business records not required for administration |

## 11. Integration architecture

The visible PropertyMax REST documentation exposed a GET users resource suitable for directory and assignment synchronization, but it was not sufficient for the full operating model at the time of review.[1] Integration should therefore mature in controlled stages rather than assuming all source objects are immediately available.

| Stage | Input | ClickUp action | Cadence | Essential control |
|---|---|---|---|---|
| Foundation | PropertyMax users endpoint | Maintain non-sensitive People/Role references and routing | Nightly | Immutable user ID upsert; token stored only in secure integration configuration |
| Pilot | Approved Vacancy/Hub exports | Upsert Vacancy Cases and KPI Exceptions | Daily after source refresh | `source + object ID + report date` idempotency key |
| Operational | Read-only vacancy, call, guest-card, inspection, delinquency, and work-order APIs | Near-real-time exception creation/update | Event-driven or approved interval | Field allowlist, audit log, retries, dead-letter queue |
| Closed loop | Approved write API | Return limited acknowledgement, assignment, or resolution state | Event-driven | Explicit field ownership, least privilege, conflict rules, audit |

### Sync rules

| Rule | Required behavior |
|---|---|
| Source ownership | Each synchronized field has one declared authoritative system |
| Upsert | Use immutable source object ID and task type; never match only by title |
| Deletion | Archive or mark source-deleted; do not hard-delete automatically |
| Conflict | Source-owned fields overwrite ClickUp; ClickUp-owned coordination fields never write back without approval |
| Retry | Exponential delay with maximum attempt count and human escalation |
| Webhook security | HTTPS, signature validation, replay protection, timestamp checks, secret rotation |
| Logging | Store event ID, source, object ID, action, result, timestamp, and non-secret error class |
| Privacy | Transfer only allowlisted fields required to coordinate work |
| Reconciliation | Daily counts and exception sampling; weekly stale-record review |

## 12. Permissions, privacy, and governance

ClickUp should not become a shadow resident, payroll, or safety database. Relationships do not override permissions to the related item, so master records and restricted process Spaces must be configured carefully.[3]

| Control area | Standard |
|---|---|
| Data minimization | Store only what is required to assign and verify operational work |
| Resident information | Use property/unit and secure OneSite reference; no SSN, bank data, full ledger, screening report, or unnecessary identity data |
| People information | Use limited employee reference, role, supervisor, property/region, and effective date; no compensation, tax, bank, medical, or benefit details |
| Safety evidence | Keep detailed patrol telemetry and sensitive incident evidence in the approved safety source |
| Guest access | No access to Confidential/Restricted locations unless explicitly approved and reviewed |
| Field creation | New workspace-wide field requires owner, definition, scope, privacy class, and reporting purpose |
| Automation change | Test in sandbox/pilot List with representative non-sensitive records; document owner and rollback |
| Quarterly review | Audit permissions, inactive users, guest access, unused fields, automations, stale accepted exceptions, and source links |
| Record retention | Apply ApartmentCorp’s approved retention schedule; do not rely on task age alone |

### Governance roles

| Role | Accountabilities |
|---|---|
| Executive sponsor | Approves scope, operating standards, privacy posture, and cross-functional decisions |
| Workspace product owner | Owns backlog, taxonomy, adoption, and roadmap |
| ClickUp administrator | Implements fields, templates, views, permissions, automations, and audits |
| System owner | Defines source field ownership, API access, and reconciliation expectations |
| Data steward | Maintains Property, Unit, Person/Role, Vendor, and Metric master records |
| Regional process owner | Validates workflows, thresholds, manager cadence, and adoption |
| Security/privacy approver | Reviews sensitive data, integrations, guest access, and incident controls |

## 13. Implementation roadmap

The roadmap below assumes an August 3, 2026 start for planning purposes. The sequence matters more than the illustrative dates: governance and master records precede workflow pilot; pilot evidence precedes broader integration; controlled rollout precedes executive dependence on the dashboards.

![Phased implementation roadmap](https://files.manuscdn.com/user_upload_by_module/session_file/310519663449376037/BGjfzwxkHtcXqiZv.png)

| Phase | Duration | Principal deliverables | Exit criteria |
|---|---:|---|---|
| 0. Decision and governance | 2 weeks | Sponsor, product owner, ClickUp plan confirmation, privacy rules, naming, thresholds, integration owners | Written design decisions approved |
| 1. Foundation | 2 weeks | Spaces, master records, role routing, field dictionary, task types, permissions, governance Lists | Test property/unit/person records relate correctly; permissions validated |
| 2. Vacancy and Help pilot | 4–5 weeks | Vacancy/Turn templates, Help Form, Manager Attention Queue, regional review, initial dashboards | Pilot managers complete real weekly cadence without duplicate uncontrolled work |
| 3. Integration core | 4 weeks | User sync, export/API adapter, idempotency, retry queue, sync logging, reconciliation | Reprocessing creates no duplicates; errors are actionable and auditable |
| 4. Maintenance and inspections | 3 weeks | AppWork exceptions, inspection/finding workflows, evidence and reinspection controls | Critical cases escalate and parent closure gates work |
| 5. OneSite and People coordination | 3 weeks | Limited-reference collections/resident and employee lifecycle workflows | Privacy review passed; restricted access tested |
| 6. Portfolio rollout | 3 weeks | Regional training, SOPs, role dashboards, scheduled reviews, adoption support | Managers use queues and dashboards in operating meetings |
| 7. Stabilization | 3 weeks | Audit, metric validation, automation tuning, duplicate cleanup, roadmap backlog | Data quality and adoption targets approved by sponsor |

### First 30 implementation tasks

| # | Task | Owner role | Dependency | Deliverable |
|---:|---|---|---|---|
| 1 | Name the executive sponsor and workspace product owner | Executive | None | RACI approved |
| 2 | Confirm ClickUp plan and feature availability | Product owner/admin | 1 | Plan capability matrix |
| 3 | Approve system-of-record and field-ownership rules | System owners | 1 | Data ownership register |
| 4 | Approve privacy classification and prohibited data | Security/privacy | 1 | Data handling standard |
| 5 | Approve Region, Property, Unit, Role, and System identifiers | Data steward | 3 | Identifier standard |
| 6 | Build the nine Spaces and restricted permissions | ClickUp admin | 2,4 | Workspace shell |
| 7 | Create custom task types | ClickUp admin | 5,6 | Task-type catalog |
| 8 | Create the shared field dictionary | ClickUp admin/data steward | 5,7 | Controlled fields |
| 9 | Load pilot Property records | Data steward | 8 | Property master |
| 10 | Load pilot Unit records | Data steward | 9 | Unit master |
| 11 | Load limited Person/Role routing records | Data steward/HR | 4,8 | Assignment directory |
| 12 | Validate relationships and rollups | ClickUp admin | 9–11 | Relationship test report |
| 13 | Build Vacancy Case template | Process owner/admin | 7,8 | Template |
| 14 | Build Turn Workstream template | Maintenance owner/admin | 13 | Linked template |
| 15 | Build Help Request Form and template | Shared services/admin | 7,8 | Intake form |
| 16 | Configure vacancy statuses and transition rules | Process owner/admin | 13 | Vacancy workflow |
| 17 | Configure help statuses and SLA fields | Shared services/admin | 15 | Help workflow |
| 18 | Configure automations A-001 through A-008 | ClickUp admin | 13–17 | Pilot automation set |
| 19 | Create Manager Attention Queue | Operations/admin | 18 | Portfolio exception view |
| 20 | Create Regional Review template | Operations/admin | 19 | Weekly management cadence |
| 21 | Build Property Daily dashboard | ClickUp admin | 13–19 | Property dashboard |
| 22 | Build Regional Risk dashboard | ClickUp admin | 19,20 | Regional dashboard |
| 23 | Define pilot properties and users | Sponsor/regional owner | 9–11 | Pilot roster |
| 24 | Execute privacy and permission tests | Security/admin | 6,15,21,22 | Test evidence |
| 25 | Run sample source exports and mapping review | System owner/data steward | 3,5 | Mapping workbook |
| 26 | Build idempotent import/upsert adapter | Integration owner | 25 | Pilot adapter |
| 27 | Configure sync failure and reconciliation queues | Integration owner/admin | 26 | Data quality controls |
| 28 | Train pilot property and regional managers | Process owner | 13–24 | Training completion |
| 29 | Run two weekly operating cycles | Pilot team | 28 | Issues and adoption log |
| 30 | Approve scale, revise, or stop decision | Executive sponsor | 29 | Phase-gate decision |

## 14. Success measures

These are proposed measures, not baselines. Targets must be approved after the pilot establishes current performance.

| Dimension | Measure | Formula or test | Desired direction |
|---|---|---|---|
| Accountability | Actionable exceptions with one owner and due date | Complete ownership ÷ open actionable exceptions | Increase toward 100% |
| Responsiveness | Median time to acknowledge by priority | Acknowledged timestamp − created/detected timestamp | Decrease |
| Reliability | Exceptions resolved within approved SLA | In-SLA closures ÷ total closures | Increase |
| Vacancy control | Preleased units at move-in risk | Preleased with readiness below approved threshold | Decrease |
| Maintenance | Vacancy-blocking exceptions by age | Count grouped by aging band | Decrease, especially oldest bands |
| Inspection | Critical findings overdue or awaiting verification | Open critical findings beyond due/review date | Decrease toward zero |
| Data quality | Duplicate synchronized records | Duplicate idempotency key count | Zero |
| Integration | Source sync freshness compliance | Current records ÷ records expected to sync | Increase |
| Adoption | Regional reviews completed with decisions and owner/due-date evidence | Complete reviews ÷ scheduled reviews | Increase |
| Improvement | Repeated help categories converted to approved SOP/training action | Knowledge actions ÷ repeated categories reviewed | Increase |

## 15. Interactive portal mock-up

An interactive **PropertyMax Operations Portal** prototype accompanies this blueprint. It demonstrates the command-center concept rather than connecting to live ClickUp or PropertyMax data. The prototype includes:

| Prototype area | Demonstrated interaction |
|---|---|
| Three-rail workspace | Source modules on the left, portfolio command center in the middle, manager attention on the right |
| Operating scope | Region and property filtering plus attention-only mode |
| Source-system shortcuts | AppWork–Admin, Help, Hub, Vacancy, AppWork, Inspections, OneSite, and Paychex |
| Executive brief | Decision-led summary and direct route into the manager queue |
| Metric ledger | Manager attention, vacancy risk, maintenance blocks, and compliance risk |
| Dashboard charts | Seven-day attention trend and portfolio risk mix |
| Manager queue | Search, view switching, task selection, owner, due date, risk, and source stamp |
| Task detail | Operational task summary, source link, checklist, and activity timeline |
| Responsive layout | Desktop command center and mobile operating view |

The mock-up’s sample names, counts, dates, and chart values are **illustrative interface content only**. They must not be treated as PropertyMax portfolio results.

## 16. Recommended decision

Proceed with a **controlled Vacancy + Help pilot** rather than attempting to integrate all green tabs at once. This pilot exercises the most important capabilities—master relationships, cross-functional ownership, forms, SLA automation, exception queues, dashboards, privacy, and management cadence—while limiting integration complexity. After two complete weekly operating cycles, use the phase gate to approve, revise, or stop broader AppWork, inspection, OneSite, and Paychex coordination.

## References

[1]: https://www.propertymax.ai/ "PropertyMax.ai authenticated application and REST API documentation, reviewed July 14, 2026"
[2]: https://help.clickup.com/hc/en-us/articles/13856392825367-Intro-to-the-Hierarchy "ClickUp Help: Intro to the Hierarchy"
[3]: https://help.clickup.com/hc/en-us/articles/6304528030743-Intro-to-Relationships "ClickUp Help: Intro to Relationships"
[4]: https://help.clickup.com/hc/en-us/articles/6303536766231-Intro-to-Custom-Fields "ClickUp Help: Intro to Custom Fields"
[5]: https://help.clickup.com/hc/en-us/articles/6312197753239-Intro-to-Dashboards "ClickUp Help: Intro to Dashboards"
[6]: https://help.clickup.com/hc/en-us/articles/35446142759575-Use-Custom-Fields-in-Automations "ClickUp Help: Use Custom Fields in Automations"
[7]: https://help.clickup.com/hc/en-us/articles/35313844961943-Integrate-ClickUp-using-Automation-webhooks "ClickUp Help: Integrate ClickUp using Automation webhooks"
[8]: https://developer.clickup.com/docs/webhooks "ClickUp Developer Documentation: Webhooks"
