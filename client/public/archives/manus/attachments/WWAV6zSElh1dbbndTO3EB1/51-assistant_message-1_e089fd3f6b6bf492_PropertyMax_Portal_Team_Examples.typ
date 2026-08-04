// PropertyMax ClickUp Portal — Team Use Examples
// Design: Operational Command Ledger; condensed internal field guide.

#let ink = rgb("#0d1726")
#let navy = rgb("#081525")
#let navy2 = rgb("#10233a")
#let green = rgb("#2fb36e")
#let green-dark = rgb("#137447")
#let mint = rgb("#e8f5ed")
#let amber = rgb("#e4a82f")
#let amber-soft = rgb("#fff6df")
#let red = rgb("#d65e58")
#let red-soft = rgb("#fff0ef")
#let paper = rgb("#f7f8f5")
#let rule = rgb("#d8ddd8")
#let muted = rgb("#68736f")

#set document(
  title: "PropertyMax ClickUp Portal — Team Use Examples",
  author: "Manus AI",
  keywords: ("PropertyMax", "ClickUp", "operations", "team guide"),
)

#set page(
  paper: "us-letter",
  margin: (top: 0.7in, bottom: 0.65in, left: 0.68in, right: 0.68in),
  fill: white,
  numbering: "1",
  header: context {
    if counter(page).get().first() > 1 {
      set text(font: "DejaVu Sans Mono", size: 6.5pt, fill: muted)
      grid(
        columns: (1fr, auto),
        align(left)[PROPERTYMAX / OPERATIONS PORTAL],
        align(right)[TEAM USE EXAMPLES],
      )
      v(3pt)
      line(length: 100%, stroke: 0.45pt + rule)
    }
  },
  footer: context {
    set text(font: "DejaVu Sans Mono", size: 6.3pt, fill: muted)
    line(length: 100%, stroke: 0.45pt + rule)
    v(3pt)
    grid(
      columns: (1fr, auto, 1fr),
      align(left)[INTERNAL TEAM GUIDE · TEST3],
      align(center)[#counter(page).display("1")],
      align(right)[ILLUSTRATIVE RECORDS — NOT LIVE DATA],
    )
  },
)

#set text(font: "Liberation Sans", size: 9pt, fill: ink)
#set par(justify: false, leading: 0.65em, spacing: 0.55em)
#set heading(numbering: none)
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  v(2pt)
  text(font: "DejaVu Sans Mono", size: 6.8pt, weight: "bold", fill: green-dark)[FIELD GUIDE]
  v(3pt)
  text(size: 20pt, weight: "bold", fill: navy)[#it.body]
  v(5pt)
  line(length: 100%, stroke: 1.2pt + green)
  v(9pt)
}
#show heading.where(level: 2): it => {
  v(7pt)
  block(
    width: 100%,
    inset: (left: 7pt, top: 3pt, bottom: 3pt),
    stroke: (left: 2pt + green),
    text(font: "DejaVu Sans Mono", size: 8pt, weight: "bold", fill: navy)[#it.body],
  )
  v(3pt)
}
#show heading.where(level: 3): it => {
  v(5pt)
  text(size: 10.5pt, weight: "bold", fill: navy)[#it.body]
  v(2pt)
}
#show link: set text(fill: green-dark)
#show strong: set text(fill: navy)

#let eyebrow(body) = text(font: "DejaVu Sans Mono", size: 6.7pt, weight: "bold", fill: green)[#body]

#let tag(body, color: green-dark, fill: mint) = box(
  inset: (x: 5pt, y: 2.5pt),
  fill: fill,
  stroke: 0.5pt + color,
  text(font: "DejaVu Sans Mono", size: 6.2pt, weight: "bold", fill: color)[#body],
)

#let note(title, body, kind: "info") = {
  let c = if kind == "warning" { amber } else if kind == "danger" { red } else { green }
  let bg = if kind == "warning" { amber-soft } else if kind == "danger" { red-soft } else { mint }
  block(
    width: 100%,
    inset: 8pt,
    fill: bg,
    stroke: (left: 3pt + c, top: 0.5pt + rule, right: 0.5pt + rule, bottom: 0.5pt + rule),
    [#text(font: "DejaVu Sans Mono", size: 6.6pt, weight: "bold", fill: c)[#title]
    #v(3pt)
    #text(size: 8.5pt)[#body]],
  )
}

#let example(title: none, when: none, owner: none, flow: none, good: none, boundary: none) = block(
  width: 100%,
  breakable: true,
  stroke: 0.55pt + rule,
  inset: 0pt,
  [
    #block(width: 100%, fill: navy, inset: 8pt)[
      #eyebrow[ILLUSTRATIVE USE CASE]
      #v(2pt)
      #text(size: 12.5pt, weight: "bold", fill: white)[#title]
    ]
    #grid(
      columns: (0.92fr, 1.08fr),
      column-gutter: 0pt,
      [#block(width: 100%, inset: 8pt, fill: paper)[
        #eyebrow[WHEN TO USE IT]
        #v(2pt)
        #text(size: 8.3pt)[#when]
        #v(7pt)
        #eyebrow[ACCOUNTABLE OWNER]
        #v(2pt)
        #text(size: 8.3pt, weight: "bold")[#owner]
      ]],
      [#block(width: 100%, inset: 8pt)[
        #eyebrow[PORTAL FLOW]
        #v(2pt)
        #text(size: 8.3pt)[#flow]
      ]],
    )
    #line(length: 100%, stroke: 0.45pt + rule)
    #grid(
      columns: (1fr, 1fr),
      column-gutter: 0pt,
      [#block(width: 100%, inset: 8pt)[
        #eyebrow[WHAT GOOD LOOKS LIKE]
        #v(2pt)
        #text(size: 8.3pt)[#good]
      ]],
      [#block(width: 100%, inset: 8pt, fill: paper)[
        #eyebrow[SOURCE-SYSTEM BOUNDARY]
        #v(2pt)
        #text(size: 8.3pt)[#boundary]
      ]],
    )
  ],
)

#let record(title, body) = block(
  width: 100%,
  inset: 8pt,
  fill: rgb("#f3f5f2"),
  stroke: 0.55pt + rule,
  [#eyebrow[#title]
  #v(4pt)
  #text(font: "DejaVu Sans Mono", size: 7.2pt, fill: ink)[#body]],
)

#let rolecard(role, start, inspect, convert) = block(
  width: 100%,
  inset: 8pt,
  stroke: 0.55pt + rule,
  [#text(size: 10pt, weight: "bold", fill: navy)[#role]
  #v(4pt)
  #eyebrow[START]
  #v(1pt)
  #text(size: 7.8pt)[#start]
  #v(4pt)
  #eyebrow[INSPECT]
  #v(1pt)
  #text(size: 7.8pt)[#inspect]
  #v(4pt)
  #eyebrow[CONVERT]
  #v(1pt)
  #text(size: 7.8pt)[#convert]],
)

// COVER
#page(margin: 0in, header: none, footer: none, fill: navy)[
  #place(top + left, dx: 0.55in, dy: 0.5in)[
    #text(font: "DejaVu Sans Mono", size: 7.5pt, weight: "bold", fill: green)[PROPERTYMAX / OPERATIONS PORTAL]
  ]
  #place(top + right, dx: -0.55in, dy: 0.5in)[
    #tag[INTERNAL FIELD GUIDE]
  ]
  #place(top + left, dx: 0.55in, dy: 1.45in)[
    #block(width: 6.4in)[
      #text(size: 32pt, weight: "bold", fill: white, tracking: -0.8pt)[
        How our teams can use the ClickUp portal
      ]
      #v(10pt)
      #text(size: 13pt, fill: rgb("#b9c8c1"))[
        Practical examples for property operations, regional leadership, maintenance, leasing, inspections, Help, people operations, and integration governance.
      ]
      #v(16pt)
      #line(length: 1.1in, stroke: 3pt + green)
    ]
  ]
  #place(bottom + left, dx: 0.55in, dy: -0.65in)[
    #block(width: 6.9in, inset: 12pt, fill: navy2, stroke: 0.6pt + rgb("#29435d"))[
      #grid(columns: (1fr, 1fr, 1fr), column-gutter: 12pt,
        [#eyebrow[USE]
        #v(2pt)
        #text(size: 9pt, fill: white)[Coordinate outcomes across green-tab systems.]],
        [#eyebrow[OWN]
        #v(2pt)
        #text(size: 9pt, fill: white)[Give every commitment one accountable owner.]],
        [#eyebrow[VERIFY]
        #v(2pt)
        #text(size: 9pt, fill: white)[Close work with evidence and source links.]],
      )
      #v(11pt)
      #text(font: "DejaVu Sans Mono", size: 6.5pt, fill: rgb("#91a39b"))[
        PREPARED BY MANUS AI · JULY 14, 2026 · TEST3 · ALL RECORDS ARE ILLUSTRATIVE
      ]
    ]
  ]
]

= The portal in one page

The portal is the team's *system of action*. It does not replace the specialist systems behind the green navigation tabs. It gives the organization one place to see exceptions, assign accountable work, coordinate cross-functional dependencies, record decisions, and verify closure.

#figure(
  image("team_examples_assets/command-center.png", width: 100%),
  caption: [The Operations command center brings exceptions, owners, due times, source labels, and portfolio risk into one controlled view.],
)

#table(
  columns: (1.05fr, 1.15fr, 1.1fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if y == 0 { navy } else if calc.odd(y) { paper } else { white },
  table.header(
    [#text(weight: "bold", fill: white)[SOURCE SYSTEM]],
    [#text(weight: "bold", fill: white)[PORTAL RECORD]],
    [#text(weight: "bold", fill: white)[OWNED OUTCOME]],
  ),
  [Vacancy], [Vacancy Case], [Ready-to-show, prelease, or move-in milestone],
  [AppWork], [Work Order Exception / Turn Workstream], [Blocked work resolved and verified],
  [Inspections], [Inspection Finding], [Evidence accepted and reinspection complete],
  [Help / Hub], [Help Request / Knowledge Candidate], [Question resolved and repeat issue documented],
  [OneSite / RealPage], [Resident or financial exception], [Authorized exception decision],
  [Paychex], [Restricted lifecycle/access task], [Access, training, or equipment complete],
)

#note(
  [ONE WORKING RULE],
  [When a message contains an action and a deadline, create or link a task. When a discussion produces a decision, record the decision and approver in the task.],
)

== What belongs in a portal task

#table(
  columns: (1fr, 3fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Include]],
  [A clear outcome, one accountable owner, due date, property/unit identifiers, approved source link, status, blocker, next action, and evidence reference.],
  [#text(weight: "bold", fill: navy)[Keep in source system]],
  [Passwords, API keys, payroll details, Social Security numbers, banking information, full resident ledgers, screening decisions, legal notes, and unredacted sensitive documents.],
)

= A practical daily operating rhythm

The portal should reduce chasing, not add another inbox. Each role starts from a focused view, acts only on owned or relevant exceptions, and converts conversation into durable work.

#table(
  columns: (0.65fr, 1.25fr, 1.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if y == 0 { navy } else if calc.odd(y) { paper } else { white },
  table.header([#text(weight: "bold", fill: white)[MOMENT]], [#text(weight: "bold", fill: white)[TEAM ACTION]], [#text(weight: "bold", fill: white)[PORTAL BEHAVIOR]]),
  [Start of day], [Open role-specific attention view], [Review P1, overdue, due-today, and blocked items before reading general chat.],
  [Daily huddle], [Confirm risks, owners, and next update], [Open the task from the meeting; do not recreate the status in a separate note.],
  [During work], [Update only material changes], [Record source link, blocker, decision request, or evidence. Avoid “still working” noise.],
  [Handoff], [Name the next accountable owner], [Reassign only when responsibility genuinely changes; explain the handoff in a comment.],
  [End of day], [Clear unresolved same-day commitments], [Escalate at-risk work and state the next update time.],
)

#record(
  [STANDARD TASK ANATOMY],
  [TITLE     VAC · Pine Ridge · Unit 204 · Preleased move-in at risk
OWNER     Property Manager
DUE       Today · 11:30 AM ET
SEVERITY  P1 / Move-in risk
SOURCE    Vacancy record + AppWork turn link
IMPACT    Resident move-in scheduled tomorrow; readiness at 62%
NEXT      Maintenance Supervisor confirms recovery plan by 10:00 AM
EVIDENCE  Final inspection link and approved ready timestamp],
)

#note(
  [TASK VS. CHECKLIST ITEM],
  [Use a checklist item when the step is small, stays inside one owned outcome, and needs no separate discussion. Use a task or subtask when it has a different owner, due date, dependency, or evidence trail. ClickUp supports assigning individual checklist items and converting them into tasks or subtasks.[1]],
)

= Property and regional management

#example(
  title: [Preleased move-in at risk],
  when: [A preleased unit is not on track for the promised ready or move-in date.],
  owner: [Property Manager],
  flow: [Vacancy status or a team member creates/updates a Vacancy Case → maintenance and leasing workstreams link to it → owner records the recovery decision → final readiness evidence is linked → property manager closes the case.],
  good: [The team can answer: What is at risk? Who owns recovery? What decision is needed? When is the next update? What evidence proves the unit is ready?],
  boundary: [Detailed work-order labor and materials stay in AppWork. Applicant/resident records and regulated decisions stay in the authorized property-management system.],
)

#v(8pt)

#example(
  title: [Weekly regional exception review],
  when: [A regional manager needs to resolve cross-property aging, workload, or repeat-risk patterns.],
  owner: [Regional Manager],
  flow: [Open the regional dashboard → filter to critical, overdue, and blocked → review the oldest/highest-impact tasks → record each decision in the task → create one regional action only when the issue spans multiple properties.],
  good: [The meeting produces named owners and dates, not a second status document. Repeated exceptions become root-cause or training actions.],
  boundary: [Portfolio metrics may summarize source data, but source financial, resident, payroll, and work-order detail remains in its governed system.],
)

#record(
  [REGIONAL REVIEW COMMENT],
  [[DECISION] Approve one-day vendor recovery plan up to the authorized threshold.
OWNER: Maintenance Supervisor
DUE: Today · 3:00 PM ET
NEXT UPDATE: Vendor arrival confirmed by noon.
SOURCE: AppWork WO-8821
APPROVER: Regional Manager],
)

== Useful management views

#table(
  columns: (1fr, 2.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Property Attention]], [Open P1, overdue, due-today, move-in risk, inspection findings, and unresolved Help Requests for one property.],
  [#text(weight: "bold", fill: navy)[Regional Attention]], [Same control set rolled across a region, with ownership and aging.],
  [#text(weight: "bold", fill: navy)[Executive Decisions]], [Only issues requiring policy, funding, risk acceptance, or cross-region priority.],
  [#text(weight: "bold", fill: navy)[Commitment Calendar]], [Date-driven work that will materially affect residents, compliance, payroll, or operations.],
)

= Maintenance and turns

#example(
  title: [Emergency water intrusion],
  when: [An active leak, life-safety concern, major outage, or similar event needs immediate acknowledgement and cross-functional coordination.],
  owner: [Maintenance Supervisor],
  flow: [Phone/urgent channel initiates response → portal P1 task links the AppWork work order → owner records impact, containment, vendor/parts status, and next update → regional manager joins if threshold is met → closure requires source completion plus evidence.],
  good: [Urgent contact happens immediately, while the task maintains one timestamped operational record. The incident does not disappear inside chat.],
  boundary: [AppWork remains the work-order authority. Resident-sensitive details and insurance/legal material stay in authorized systems.],
)

#v(8pt)

#example(
  title: [Turn blocked by parts or vendor],
  when: [A make-ready milestone cannot proceed and may affect market-ready or move-in dates.],
  owner: [Maintenance Supervisor],
  flow: [Turn Workstream receives/records blocker → assign the recovery step → record ETA and decision threshold → update Vacancy Case if market/move-in date is affected → accept final evidence at the readiness gate.],
  good: [The portal distinguishes the source work order from the cross-functional blocker, so leasing and property teams see the impact without duplicating every technician update.],
  boundary: [Technician labor, parts, cost details, and work completion remain in AppWork. The portal holds only the exception, impact, owner, decision, and source link.],
)

#record(
  [P1 OPERATIONAL MESSAGE],
  [[P1] Willow Creek B-17 — Active water intrusion
IMPACT: Two units affected; containment underway.
OWNER: Maintenance Supervisor
NEXT UPDATE: 10:30 AM ET
DECISION NEEDED: Authorize emergency vendor if internal response misses ETA.
SOURCE: AppWork WO-8821
PORTAL: Linked P1 exception task],
)

= Leasing and vacancy

#example(
  title: [Vacancy Case from notice through ready-to-show],
  when: [A unit becomes notice, vacant, make-ready, ready-to-show, preleased, or move-in pending.],
  owner: [Property Manager],
  flow: [Create one Vacancy Case per unit cycle → relate turn, pricing/marketing, and prospect/move-in workstreams → use milestone fields rather than chat-only updates → close after authorized readiness and occupancy milestones.],
  good: [The case shows the current stage, target dates, blocker, responsible team, next decision, and source links without forcing users to reconcile several unrelated tasks.],
  boundary: [Applicant screening, resident documents, lease, ledger, concessions, and personal data stay in the authorized leasing/property system.],
)

#v(8pt)

#example(
  title: [Stale qualified prospect follow-up],
  when: [A qualified lead has no recorded next action inside the approved follow-up interval.],
  owner: [Leasing Agent],
  flow: [Prospect milestone creates/updates a follow-up task → agent records outcome code and next date → task closes on appointment, application, disqualification under policy, or documented no-response sequence.],
  good: [Managers can see follow-up aging and coaching demand without exposing unnecessary applicant details in the portal.],
  boundary: [Screening outcomes, protected-class information, identity documents, and application records never belong in the portal task.],
)

#note(
  [STRUCTURED INTAKE],
  [A ClickUp Form can turn a standardized submission into a task in a selected location, and settings can apply a task template or automatic assignee.[2] Use this for approved Help, training, inspection-exception, or new-property intake — never for passwords or unrestricted sensitive uploads.],
)

= Inspections and compliance

#example(
  title: [Life-safety finding requires evidence review],
  when: [An inspection identifies a critical deficiency requiring remediation, evidence, and possibly reinspection.],
  owner: [Compliance Reviewer],
  flow: [Inspection source creates/updates a Finding task → assign remediation owner and due date by severity → maintenance links source work → evidence is submitted through an authorized link → reviewer accepts or rejects evidence → schedule reinspection if required.],
  good: [The finding remains open until the authorized reviewer verifies closure. “Work completed” is not the same as “finding closed.”],
  boundary: [The inspection platform remains authoritative for the original finding, inspection report, signatures, and official closure record.],
)

#record(
  [FINDING RECORD],
  [TITLE       INS · Lakeview · Unit 311 · Egress obstruction
SEVERITY    Critical
OWNER       Compliance Reviewer
REMEDIATOR  Maintenance Supervisor
DUE         Today · 1:00 PM ET
SOURCE      Inspection INS-451 + linked AppWork order
EVIDENCE    Authorized image/report link
CLOSE WHEN  Reviewer accepts evidence and required reinspection passes],
)

== What the inspector should see

#table(
  columns: (1fr, 2.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Open finding]], [Severity, due date, property/unit, remediation owner, source link, evidence status, reinspection need.],
  [#text(weight: "bold", fill: navy)[Rejected evidence]], [Reviewer reason, correction needed, new due date, accountable owner.],
  [#text(weight: "bold", fill: navy)[Closed finding]], [Accepted evidence reference, reviewer, closure timestamp, official source record.],
)

= Help and training

#example(
  title: [Help Request becomes a knowledge candidate],
  when: [A team member cannot complete a process, access a system, or interpret a procedure.],
  owner: [Functional Owner],
  flow: [User submits structured Help Form → submission creates a Help Request task → coordinator categorizes impact and routes to owner → owner resolves and records source/SOP link → repeat issue is related to a Knowledge Candidate or training action.],
  good: [The request is resolved for the user and produces a reusable improvement when the same confusion appears repeatedly.],
  boundary: [The request must not contain passwords, authentication codes, full resident records, payroll details, or sensitive screenshots.],
)

#v(8pt)

#example(
  title: [Training request after a repeated workflow error],
  when: [Multiple properties show the same process mistake or onboarding gap.],
  owner: [Training Coordinator],
  flow: [Link related Help Requests/findings → define the learning outcome → assign process owner for accuracy review → schedule target audience → publish approved reference → record attendance/acknowledgment under policy.],
  good: [Training responds to evidence, has an owner and audience, and links back to the operational problem it is designed to reduce.],
  boundary: [Employment records and protected HR information remain in approved HR systems. The portal stores only the workflow/training evidence permitted by policy.],
)

#record(
  [HELP FORM FIELDS],
  [REQUEST TYPE · FUNCTION · PROPERTY/REGION · BUSINESS IMPACT
WHAT WERE YOU TRYING TO DO? · WHAT HAPPENED?
AUTHORIZED SOURCE LINK · SAFE SCREENSHOT (OPTIONAL)
DEADLINE OR EVENT AT RISK · BEST CONTACT METHOD],
)

= People operations

#example(
  title: [New property manager readiness],
  when: [A new or transferred manager needs coordinated access, training, equipment, and property assignment.],
  owner: [Hiring/Receiving Manager],
  flow: [Restricted onboarding parent task → checklist/subtasks for approved access, property assignment, required training, equipment, and first-week reviews → each system owner confirms completion → manager accepts readiness.],
  good: [Every readiness control has an owner and due date; the task contains safe status only, not payroll or employment documents.],
  boundary: [Pay, tax forms, banking, SSN, background checks, benefits, medical information, and performance/disciplinary content stay in Paychex or the approved HR record.],
)

#v(8pt)

#example(
  title: [Offboarding access control],
  when: [An employee or vendor relationship ends or access must be reduced.],
  owner: [HR/IT Access Owner],
  flow: [Restricted event triggers time-bound access checklist → system owners revoke/transfer approved access → service identities and shared ownership are reviewed → completion evidence is recorded → HR/IT approves closure.],
  good: [Access is removed on time, operational ownership is transferred, and completion is auditable without exposing the reason for separation broadly.],
  boundary: [Termination reason, legal correspondence, payroll, and personnel records remain restricted to authorized HR/legal systems.],
)

#note(
  [PERMISSION RULE],
  [People Operations tasks and Docs should be private and role-scoped. A manager should see only the onboarding, access, training, or equipment work needed to act — not underlying HR or payroll data.],
  kind: "warning",
)

= Integration and data operations

#example(
  title: [Failed synchronization creates an Integration Error],
  when: [A source event cannot be authenticated, validated, mapped, delivered, or reconciled.],
  owner: [Integration Engineer],
  flow: [Monitoring creates/updates one Integration Error by connector and incident → classify error → record affected count and correlation ID → pause/retry according to runbook → data/system owner validates impact → reconcile before closure.],
  good: [The portal shows business impact and recovery ownership. Technical logs contain safe diagnostic detail, while secrets and sensitive payloads remain outside the task.],
  boundary: [API keys, OAuth tokens, webhook secrets, full payloads, and unrestricted logs are never pasted into ClickUp. Use a vault reference and approved observability system.],
)

#v(8pt)

#example(
  title: [Property or unit mapping exception],
  when: [An incoming record has no approved property/unit match or conflicts with the canonical identity.],
  owner: [Data Steward],
  flow: [Quarantine the event → create Master Data Exception → compare authoritative IDs → propose mapping change with before/after impact → business and technical owners approve → replay safely → reconcile affected records.],
  good: [No operational task is created against a guessed property or unit. The mapping decision is explicit, reviewable, and reusable.],
  boundary: [The portal tracks the exception and decision. Canonical source records are changed only in the authorized system by an approved role.],
)

#record(
  [INTEGRATION ERROR RECORD],
  [CONNECTOR      Vacancy → ClickUp
ENVIRONMENT    Production
ERROR CLASS    Missing unit mapping
CORRELATION    cor_20260714_09422
AFFECTED       7 events quarantined
OWNER          Integration Engineer
DATA OWNER     Property Master Data Steward
NEXT           Mapping decision by 2:00 PM ET
SECRET REF     Vault reference only — never secret content],
)

= Communications and meetings

Use Chat, Teams, email, or phone for contact; use the task for accountability. The message should help the receiver understand impact, ownership, deadline, decision, and where the durable record lives.

#record(
  [MESSAGE-TO-TASK STANDARD],
  [[SEVERITY] [PROPERTY / REGION] — [OUTCOME OR PROBLEM]
IMPACT: Business consequence
OWNER: One accountable person
DUE / NEXT UPDATE: Date and time with timezone
BLOCKER / DECISION: Specific request
SOURCE: Authorized source-system link
PORTAL: Task link],
)

#table(
  columns: (0.85fr, 1.45fr, 1.45fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if y == 0 { navy } else if calc.odd(y) { paper } else { white },
  table.header([#text(weight: "bold", fill: white)[CHANNEL]], [#text(weight: "bold", fill: white)[GOOD USE]], [#text(weight: "bold", fill: white)[RECORD ACTION]]),
  [Task comment], [Update, blocker, question, approval, concise decision], [Keep the outcome in the parent task.],
  [ClickUp Chat], [Triage, handoff, short announcement, task link], [Convert action + deadline into a task.],
  [Microsoft Teams], [Meeting coordination and approved alert], [Link back to the portal task; do not create a competing task system.],
  [Email], [Vendor/external communication and approved digest], [Reference the task/source record when appropriate.],
  [Phone / urgent path], [Life-safety, outage, immediate P1 response], [Summarize call outcome and next update in the incident task.],
)

== Meeting examples

#table(
  columns: (1fr, 1.15fr, 1.55fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if y == 0 { navy } else if calc.odd(y) { paper } else { white },
  table.header([#text(weight: "bold", fill: white)[MEETING]], [#text(weight: "bold", fill: white)[OPEN]], [#text(weight: "bold", fill: white)[CLOSE WITH]]),
  [Daily property huddle], [Property Attention, vacancy/turn risk, critical findings], [Today's owners, decision requests, next update times.],
  [Weekly regional review], [Critical/overdue/blocked and repeat patterns], [Decisions in tasks; regional root-cause actions only.],
  [Monthly portfolio review], [Scorecard, aging, adoption, integration health], [Approved priorities, thresholds, policy or funding decisions.],
  [Incident bridge], [One incident parent and current workstreams], [Timestamped status, recovery owner, next update, closure/review.],
)

= Rollout Control — 30-Day Schedule

The interactive register gives the implementation team a shared sequence of owned milestones. Completion, notes, and evidence references are saved automatically in the browser used for the current prototype. Teams can filter by status or owner and search milestone text.

#figure(
  image("team_examples_assets/rollout-schedule.png", width: 100%),
  caption: [The 30-Day Schedule shows remaining milestones, the next accountable step, owners, progress, and an evidence or blocker note for each item.],
)

#example(
  title: [Completing Day 06 — canonical property mapping],
  when: [The data steward has produced and reconciled the approved property/region identity map.],
  owner: [Data Steward],
  flow: [Open Rollout Control → select 30-Day Schedule → locate Day 06 → add the approved mapping-document link and reconciliation result → check complete → review the next open milestone.],
  good: [The note identifies the evidence, approval owner, discrepancies resolved, and any accepted exception. A checkmark without evidence is not enough for a launch-critical control.],
  boundary: [Do not paste private employee lists, credentials, or unrestricted source exports into the note. Link to the authorized document location.],
)

#note(
  [PROTOTYPE PERSISTENCE],
  [The current portal saves checklist progress locally in the browser. That is suitable for demonstrating the workflow. For shared production progress across users and devices, connect the register to authenticated user accounts and a governed backend record.],
  kind: "warning",
)

= Rollout Control — Launch Readiness

Launch Readiness is a separate decision register. It should not be treated as a second copy of the 30-day schedule. A schedule item confirms work occurred; a launch control confirms the organization can proceed safely.

#figure(
  image("team_examples_assets/launch-readiness.png", width: 100%),
  caption: [The launch register separates schedule progress from twelve owned controls that determine whether the pilot can proceed.],
)

#example(
  title: [Verifying the production release matches staging],
  when: [The release candidate is configured and the team is preparing for the go/no-go decision.],
  owner: [ClickUp Administrator],
  flow: [Open Launch Readiness → select the release control → compare production and approved staging configuration → add comparison evidence and release version → check complete only after authorized review.],
  good: [The evidence states what was compared, by whom, when, and the result. Any difference creates an owned issue rather than being hidden in a note.],
  boundary: [Do not include tokens, secret values, private logs, or sensitive source payloads in the evidence note or screenshot.],
)

== Example go/no-go conversation

#record(
  [LAUNCH DECISION],
  [STATUS      CONDITIONAL GO
OPEN CONTROL  Notification recipient allowlist
OWNER         Operations + Integration
EVIDENCE      Controlled test with Test3 marker to designated recipient
DEADLINE      3:00 PM ET
STOP RULE     Any unapproved recipient or missing audit record
APPROVER      Executive Sponsor after control owner confirmation],
)

= First-week quick start by role

#grid(
  columns: (1fr, 1fr),
  column-gutter: 8pt,
  row-gutter: 8pt,
  rolecard(
    [Property Manager],
    [Open Property Attention and Vacancy Cases.],
    [Move-in risk, P1, overdue findings, blocked turns.],
    [Messages with action + deadline into owned tasks.],
  ),
  rolecard(
    [Regional Manager],
    [Open Regional Attention and risk concentration.],
    [Oldest/highest-impact exceptions and repeat patterns.],
    [Decisions into tasks; cross-property patterns into regional actions.],
  ),
  rolecard(
    [Maintenance Supervisor],
    [Open P1, turn blockers, and aging exceptions.],
    [Containment, ETA, parts/vendor blocker, evidence.],
    [Source work into exception coordination only when impact crosses teams.],
  ),
  rolecard(
    [Leasing Team],
    [Open Vacancy Cases and follow-up queue.],
    [Ready-to-show, stale qualified prospects, move-in risk.],
    [Approved milestone updates into next actions without sensitive applicant detail.],
  ),
  rolecard(
    [Inspector / Compliance],
    [Open critical and due-soon findings.],
    [Evidence status, remediation owner, reinspection need.],
    [Completed work into verified closure only after review.],
  ),
  rolecard(
    [Help / Training],
    [Open unowned, high-impact, and repeated requests.],
    [Routing quality, resolution, recurring confusion.],
    [Resolved requests into knowledge or training candidates.],
  ),
  rolecard(
    [People Operations],
    [Open restricted access/onboarding controls.],
    [Due access, training, equipment, and ownership transfer.],
    [Lifecycle event into minimum-necessary workflow tasks.],
  ),
  rolecard(
    [Integration / Data],
    [Open connector health, dead letters, and mapping exceptions.],
    [Affected records, auth failures, retries, reconciliation.],
    [Technical failures into owned business-impact records without secrets.],
  ),
)

== Three habits to adopt immediately

#table(
  columns: (0.35fr, 1.15fr, 2.1fr),
  inset: 7pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if y == 0 { navy } else if calc.odd(y) { paper } else { white },
  table.header([#text(weight: "bold", fill: white)[NO.]], [#text(weight: "bold", fill: white)[HABIT]], [#text(weight: "bold", fill: white)[STANDARD]]),
  [01], [Own the outcome], [One accountable owner and one due date for every commitment.],
  [02], [Link the truth], [Use approved source-system links instead of duplicating regulated or detailed source records.],
  [03], [Close with evidence], [A status change is not enough; show the authorized evidence, reviewer, or source completion.],
)

#note(
  [STOP AND ASK],
  [If you are unsure whether information is sensitive, do not paste it into the portal. Ask the data/system owner, use the minimum necessary detail, and link to the authorized source instead.],
  kind: "danger",
)

= Reference cards

== Task title patterns

#table(
  columns: (1fr, 2.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Vacancy]], [#raw("VAC · Property · Unit · Outcome/Risk")],
  [#text(weight: "bold", fill: navy)[Maintenance exception]], [#raw("MNT · Property · Unit/Asset · Exception")],
  [#text(weight: "bold", fill: navy)[Inspection finding]], [#raw("INS · Property · Unit/Area · Finding")],
  [#text(weight: "bold", fill: navy)[Help]], [#raw("HELP · Function · Property/Region · Need")],
  [#text(weight: "bold", fill: navy)[Integration]], [#raw("INT · Connector · Environment · Failure/Change")],
  [#text(weight: "bold", fill: navy)[Access]], [#raw("ACCESS · User/Role · System · Request/Event")],
)

== Status language

#table(
  columns: (1fr, 2.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Open]], [Accepted into the workflow but not actively underway.],
  [#text(weight: "bold", fill: navy)[In progress]], [Owner is actively working and the next action is known.],
  [#text(weight: "bold", fill: navy)[Blocked]], [Progress requires a named decision, dependency, part, vendor, access, or source correction.],
  [#text(weight: "bold", fill: navy)[Awaiting evidence/review]], [Work may be complete, but authorized verification is pending.],
  [#text(weight: "bold", fill: navy)[Closed]], [Outcome is verified under the applicable source-system and approval rule.],
)

== Escalation language

#table(
  columns: (1fr, 2.7fr),
  inset: 6pt,
  stroke: 0.45pt + rule,
  fill: (x, y) => if calc.odd(y) { paper } else { white },
  [#text(weight: "bold", fill: navy)[Standard]], [Assigned SLA and normal notification.],
  [#text(weight: "bold", fill: navy)[At risk]], [SLA near, material blocker, or property/region impact; same-business-day response.],
  [#text(weight: "bold", fill: navy)[P1 / Critical]], [Life safety, outage, imminent move-in failure, or compliance deadline; immediate urgent contact plus task.],
  [#text(weight: "bold", fill: navy)[Executive incident]], [Multi-property, security, payroll, or material compliance impact; incident bridge and parent task.],
)

= References

[1] #link("https://help.clickup.com/hc/en-us/articles/6309942197783-Use-task-checklists")[ClickUp Help — Use task checklists]. Accessed July 14, 2026.

[2] #link("https://help.clickup.com/hc/en-us/articles/6310233090711-Intro-to-Forms-and-Form-view")[ClickUp Help — Intro to Forms and Form view]. Accessed July 14, 2026.

#v(12pt)
#note(
  [DOCUMENT CONTROL],
  [This guide contains illustrative operational examples for the PropertyMax portal. It does not authorize production access, change source-system ownership, replace legal/HR/compliance policies, or approve an integration. Confirm plan availability, permissions, retention, and data boundaries before production use.],
)
