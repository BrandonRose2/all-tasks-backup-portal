# ApartmentCorp — Master Task List & Company Systems Inventory

> **Purpose:** This is a working, company-facing inventory of the portals, apps, websites, workflows, and documentation that are worth preserving, sharing, improving, or moving into the ApartmentCorp GitHub organization. It is intentionally structured as a **starter list**: edit names, remove items that are not active, add links, and mark progress as each item is reviewed.

**Working owner:** Brandon Rose  
**Suggested master repository:** `brandon-rose-master-task-list`  
**Recommended default visibility for company repositories:** Private  
**Important:** Do **not** place passwords, PINs, API keys, employee personal information, or unapproved confidential files in GitHub. Link only to the approved company access-management location when a system requires credentials.

## How to Use This List

Use the checkbox immediately under each project to indicate whether it belongs in the company portfolio. Then complete the implementation and documentation checklists before treating the project as ready for management or staff use.

| Suggested status | Meaning |
|---|---|
| `[ ]` | Not yet reviewed, started, or confirmed |
| `[x]` | Confirmed or completed |
| `Candidate` | Likely valuable, but needs review before migration |
| `Company-ready` | Safe to hand off, documented, and stored in its company repository |
| `Personal only` | Keep out of the company master portal and company GitHub organization |

---

# 1. Recommended Company Portfolio

## 1.1 ApartmentCorp Operations Hub / Master Portal

**Why it belongs:** This should be the central, company-only landing page that lets staff find approved systems without duplicating data across separate portals.

- [ ] **Include as a company project.**
- [ ] Confirm the official project name and live URL.
- [ ] Define the intended audiences: staff, managers, regional managers, HR, and administrators.
- [ ] Add links to approved company tools, portals, forms, reports, and resources.
- [ ] Keep personal projects, experiments, and private workspaces out of this hub.
- [ ] Define a clear permission model and administrator ownership.
- [ ] Add a simple “What this portal does” section on the home page.
- [ ] Add a “Where to get help” contact or escalation path.
- [ ] Create a repository, README, setup guide, and change log.

**Suggested repository:** `apartmentcorp-operations-hub`

---

## 1.2 New-Hire Onboarding Ecosystem

**Why it belongs:** This is a high-value operational system because it standardizes the employee onboarding experience, forms, approvals, resources, and access sequencing.

- [ ] **Include as a company project.**
- [ ] Confirm the onboarding steps and current flow.
- [ ] Document the employee, regional-manager, HR, and administrator responsibilities.
- [ ] Maintain the new-hire form workflow: employee completion, regional-manager approval, then HR/upper-management approval.
- [ ] Store applicable forms in both the onboarding area and the document area.
- [ ] Ensure forms use web form fields where appropriate.
- [ ] Keep the onboarding HTML and documentation updated whenever the flow changes.
- [ ] Confirm new hires cannot access administrative functions until onboarding is complete and approved.
- [ ] Document the weekly employee-data update process.
- [ ] Create a plain-language “How to use onboarding” guide for a new employee.

**Suggested repository:** `apartmentcorp-new-hire-onboarding`

---

## 1.3 Document Hub / Company Resource Library

**Why it belongs:** A structured document and resource hub gives employees one approved place to locate forms, policies, blank templates, and useful reference material.

- [ ] **Include as a company project.**
- [ ] Confirm the categories and folders that should be visible to employees.
- [ ] Allow authorized users to add useful resources and create organized folders.
- [ ] Establish who may upload, edit, archive, or delete documents.
- [ ] Include a process for publishing new-hire forms and approved company forms.
- [ ] Add an “Export All — Blank” function or documented process for blank PDFs, if still needed.
- [ ] Establish naming, versioning, and retention conventions.
- [ ] Confirm all files are stored in their designated company folders.
- [ ] Write a short employee guide for finding, downloading, and submitting documents.

**Suggested repository:** `apartmentcorp-document-hub`

---

## 1.4 Company Websites Information / Access Directory

**Why it belongs:** Staff need a reliable directory of the company websites they use, what each one does, and who should receive access. The directory should explain access without exposing credentials.

- [ ] **Include as a company project.**
- [ ] List each approved external website or system.
- [ ] Explain the business purpose of each website in one or two sentences.
- [ ] Identify which roles should use each website.
- [ ] Link to official sign-in pages and approved training material.
- [ ] State the access-request owner for each website.
- [ ] Keep credentials and sensitive access details outside the public-facing directory and GitHub.
- [ ] Place the “Company Websites Information” entry point next to the Document Hub where appropriate.
- [ ] Review the directory whenever a vendor, website, or employee workflow changes.

**Suggested repository:** `apartmentcorp-company-websites-directory`

---

## 1.5 Admin Portal / Management Dashboard

**Why it belongs:** A controlled management area can consolidate administrative workflows, approvals, staff controls, and high-level operational visibility.

- [ ] **Include as a company project.**
- [ ] Define which features are for administrators only.
- [ ] Confirm the manager/admin access model and document the approval process.
- [ ] Ensure the administrative entry point is visible only as appropriate and access remains restricted to authorized users.
- [ ] Document who grants, revokes, and audits access.
- [ ] Include a manager-facing “How to use this dashboard” guide.
- [ ] Confirm data shown on the home screen is accurate and tied to approved sources.
- [ ] Confirm the default theme is light, with a user-controlled dark-theme option if retained.
- [ ] Define backup, error-reporting, and support procedures.

**Suggested repository:** `apartmentcorp-admin-dashboard`

---

## 1.6 Property Directory, Organization Chart, and Property Detail System

**Why it belongs:** A single source of truth for properties, unit counts, regional assignments, managers, contacts, and organizational relationships is foundational to many other company systems.

- [ ] **Include as a company project.**
- [ ] Confirm the official property list and ownership of the source data.
- [ ] Display each property’s unit count and associated regional manager.
- [ ] Display the appropriate property contact number, including its extension where applicable.
- [ ] Ensure selecting a property automatically selects the correct region where that feature is used.
- [ ] Maintain the organization chart and property relationships.
- [ ] Establish a process for additions, sales, manager changes, and contact updates.
- [ ] Review mobile display quality for manager-facing information.
- [ ] Document the data fields, source systems, and update frequency.

**Suggested repository:** `apartmentcorp-property-directory`

---

## 1.7 Property Photo Library and Upload Organizer

**Why it belongs:** A standardized property-photo workflow reduces lost files and makes marketing, operations, and property records easier to manage.

- [ ] **Include as a company project.**
- [ ] Confirm the company folder structure: `Property Photos` with a subfolder for each property.
- [ ] Define who can upload, organize, and remove photos.
- [ ] Confirm whether dropped photos should be matched and uploaded automatically to the correct building folder.
- [ ] Define file-name, date, quality, and retention standards.
- [ ] Document how marketing and operations teams find approved photos.
- [ ] Confirm that photo uploads do not expose tenant or employee personal information.
- [ ] Create a concise upload and retrieval guide.

**Suggested repository:** `apartmentcorp-property-photo-library`

---

## 1.8 Vacancy, Leasing, and Property Status Report App

**Why it belongs:** A well-documented vacancy and leasing tool can give management timely visibility into property conditions and changes.

- [ ] **Include as a company project.**
- [ ] Confirm the information sources and update cadence.
- [ ] Use **New Vacancies** for increases in vacant units and **Recently Leased** for decreases.
- [ ] Display vacancy changes in a clear dashboard area without overlapping other content.
- [ ] Confirm the scrolling update/ticker behavior, if retained, is accessible and not distracting.
- [ ] Define staff responsibilities for entering and validating property updates.
- [ ] Cross-check dashboard data with approved data sources before publishing.
- [ ] Document the report fields, user roles, and troubleshooting steps.

**Suggested repository:** `apartmentcorp-vacancy-reporting`

---

## 1.9 Operations, Collections, and Financial Snapshot Dashboard

**Why it belongs:** A management dashboard that turns approved operating data into daily and monthly views can save time and improve decision visibility.

- [ ] **Include as a company project.**
- [ ] Confirm the approved sources for operational, billed, collected, and vacancy data.
- [ ] Present a professional daily snapshot with useful graphs and tables rather than excessive KPIs.
- [ ] Include building-level day-over-day percentage change where the underlying data supports it.
- [ ] Ensure daily changes update only after valid data is entered and saved.
- [ ] Show current-month net cash flow only in the approved format; reserve regional breakouts for completed months if applicable.
- [ ] Place Fair Market Rent data at the far right of relevant tables, if that convention remains active.
- [ ] Optimize manager-facing views for mobile devices.
- [ ] Establish quality checks, exceptions, and an owner for each data feed.
- [ ] Write separate user guides for staff viewers and dashboard administrators.

**Suggested repository:** `apartmentcorp-operations-reporting-dashboard`

---

## 1.10 Recurring Daily, Weekly, and Monthly Reporting Workflow

**Why it belongs:** Scheduled reporting is valuable when it has clear owners, verified inputs, documented recipients, and a dependable fallback process.

- [ ] **Include as a company project or documented workflow.**
- [ ] Inventory each recurring report and its purpose.
- [ ] Confirm the approved recipient lists and required regional communications.
- [ ] Document the daily report workflow and backup owner.
- [ ] Document the Saturday weekly-summary distribution workflow.
- [ ] Document the monthly net-cash-flow reporting workflow and its scheduled delivery expectation.
- [ ] Add pre-send data validation and a missed-report escalation process.
- [ ] Record whether each workflow is manual, semi-automated, or automated.
- [ ] Avoid embedding email credentials, contact lists, or other sensitive details in public documentation.

**Suggested repository:** `apartmentcorp-recurring-reporting-workflows`

---

## 1.11 Rent Roll Pulling and Filing Procedure

**Why it belongs:** Even if it is not an application, a clear, repeatable procedure for pulling and filing rent rolls is company knowledge worth preserving.

- [ ] **Include as a documented company workflow.**
- [ ] Confirm the current system steps and whether the process has changed.
- [ ] Document the required building selection, report selection, date selection, download, and filing steps.
- [ ] Specify the designated company storage location and file-naming convention.
- [ ] Define who performs the task, who reviews it, and how exceptions are handled.
- [ ] Add screenshots only after removing sensitive tenant or financial information.
- [ ] Add a one-page quick-reference version for recurring users.

**Suggested repository:** `apartmentcorp-rent-roll-procedures`

---

## 1.12 Property and Employee Data Maintenance Workflow

**Why it belongs:** Shared portals are only as useful as their data. This workflow makes data ownership and update frequency visible.

- [ ] **Include as a company project or operating procedure.**
- [ ] Identify the authoritative source for property, manager, region, unit-count, and employee data.
- [ ] Define who can request a data change and who approves it.
- [ ] Record the standard weekly employee update schedule.
- [ ] Define a process for property acquisitions, sales, renames, and regional reassignment.
- [ ] Add validation checks before publishing changes to the portal or dashboards.
- [ ] Keep an auditable change log.
- [ ] Document data definitions and any calculated fields.

**Suggested repository:** `apartmentcorp-data-maintenance`

---

## 1.13 Vendor Proposal and Invoice Template Generator

**Why it belongs:** If this workflow is actively used, it can preserve consistent vendor-facing documents while allowing project-specific layouts and approvals.

- [ ] **Review before including.** Confirm it is an approved company workflow.
- [ ] Define the intended users and approval requirements.
- [ ] Confirm which information may be included in vendor-facing documents.
- [ ] Maintain vendor-specific, industry-appropriate branding and layouts where required.
- [ ] Exclude internal-only fields from issued documents unless approved.
- [ ] Establish a review process before any proposal or invoice is sent externally.
- [ ] Store templates, logos, and final documents in approved company folders.
- [ ] Document how a user creates, reviews, exports, and archives a document.

**Suggested repository:** `apartmentcorp-vendor-document-generator`

---

# 2. Portfolio Prioritization Checklist

## Tier 1 — Start Here

These are the strongest candidates for the first company portfolio review because they support broad staff use, operational continuity, and management visibility.

- [ ] ApartmentCorp Operations Hub / Master Portal
- [ ] New-Hire Onboarding Ecosystem
- [ ] Document Hub / Company Resource Library
- [ ] Admin Portal / Management Dashboard
- [ ] Property Directory, Organization Chart, and Property Detail System
- [ ] Vacancy, Leasing, and Property Status Report App
- [ ] Operations, Collections, and Financial Snapshot Dashboard

## Tier 2 — Add After the Core Is Organized

- [ ] Company Websites Information / Access Directory
- [ ] Property Photo Library and Upload Organizer
- [ ] Recurring Daily, Weekly, and Monthly Reporting Workflow
- [ ] Rent Roll Pulling and Filing Procedure
- [ ] Property and Employee Data Maintenance Workflow
- [ ] Vendor Proposal and Invoice Template Generator, if approved for company use

## Keep Personal / Separate Unless Specifically Authorized

- [ ] Personal prototypes, experiments, private dashboards, and personal task-management systems
- [ ] Personal credentials, browser profiles, notes, bookmarks, and work-in-progress data
- [ ] Tools built for personal productivity that do not have a clear ApartmentCorp owner or support plan
- [ ] Anything containing employee personal information, tenant information, confidential financial data, or credentials until it has been reviewed and secured

---

# 3. GitHub Migration and Repository Setup Checklist

## A. Prepare Each Project Before It Leaves Your Personal Workspace

- [ ] Confirm that the project is owned by ApartmentCorp or approved for company use.
- [ ] Remove passwords, PINs, API keys, access tokens, private URLs, and confidential data.
- [ ] Add or update `.gitignore` before the first commit.
- [ ] Remove test exports, old downloads, large duplicate files, and unnecessary personal notes.
- [ ] Check that no employee, tenant, or vendor confidential information is included.
- [ ] Decide whether source code, documentation, templates, data definitions, or all of these belong in the repository.
- [ ] Identify the business owner and technical/contact owner.
- [ ] Confirm the initial repository should be private.

## B. Create and Document Each Company Repository

- [ ] Create one focused repository per major system or workflow.
- [ ] Use a consistent name beginning with `apartmentcorp-` where practical.
- [ ] Add a clear `README.md` with purpose, users, features, setup, and support contact.
- [ ] Add a `docs/` folder for the manager-facing and user-facing guides.
- [ ] Add a `CHANGELOG.md` for meaningful updates.
- [ ] Add a `LICENSE` only after confirming company policy.
- [ ] Add a `SECURITY.md` or a simple security/contact section for reporting issues.
- [ ] Document required environment variables without committing their values.
- [ ] Add release or deployment instructions if the system is hosted.
- [ ] Set repository access so company administrators retain ownership and continuity.

## C. Build the Master Repository

- [ ] Create the private repository: `brandon-rose-master-task-list`.
- [ ] Add this checklist as `portfolio-master-checklist.md`.
- [ ] Add a one-page `README.md` explaining the portfolio and repository map.
- [ ] Add `systems-overview.md` with the high-level business purpose of each approved system.
- [ ] Add `how-to-use-index.md` that links to each system’s detailed guide.
- [ ] Add `repository-map.md` with repository names, live URLs, owners, and status.
- [ ] Add a `templates/` folder containing the project-documentation template below.
- [ ] Add a review date and owner for every listed system.
- [ ] Review the master list at least quarterly or when a major workflow changes.

---

# 4. “Book of How to Use Everything” Checklist

The master portal should provide an overview, while the documentation set should let a new manager understand each system without needing to ask the original creator for basic orientation.

## Company-Wide Overview Chapter

- [ ] Explain the purpose of the ApartmentCorp systems portfolio.
- [ ] Explain which portal or app should be used for each common task.
- [ ] Include a visual system map or simple table of links.
- [ ] State who owns each system and where to ask for help.
- [ ] Explain the distinction between employee, manager, regional-manager, HR, and administrator access.
- [ ] Include an access-request and offboarding overview.

## Required Section for Every Portal, App, Website, or Workflow

- [ ] **What it is:** A one-paragraph plain-language explanation.
- [ ] **Why we use it:** The business problem it solves.
- [ ] **Who uses it:** User roles and permission levels.
- [ ] **What it contains:** Main data, documents, reports, or actions.
- [ ] **How to access it:** Approved URL, access-request owner, and any prerequisites—without credentials.
- [ ] **How to use it:** Numbered first-use instructions.
- [ ] **Common tasks:** The three to five most frequent actions.
- [ ] **Inputs and outputs:** What goes in, what gets produced, and where files are stored.
- [ ] **Data quality:** Update frequency, source of truth, and validation checks.
- [ ] **Troubleshooting:** Known issues, fallback steps, and support contact.
- [ ] **Administrator guide:** Setup, permissions, updates, and audit responsibilities.
- [ ] **Change log:** What changed, when, and who approved it.

---

# 5. Project Documentation Template

Copy the following template into each project repository as `docs/system-overview.md` or `README.md`.

```markdown
# [System / Portal / Workflow Name]

> **One-sentence purpose:** [Explain what this system does for ApartmentCorp.]

## At a Glance

| Item | Details |
|---|---|
| Business owner | [Name / role] |
| Technical/contact owner | [Name / role] |
| Primary users | [Roles] |
| Live location | [Approved URL or company location] |
| Source repository | [GitHub URL] |
| System status | [Draft / Active / Under review / Retired] |
| Last reviewed | [Date] |

## What This System Does

[Write one short paragraph in plain language.]

## Who Should Use It

[Describe user roles and what each role can do.]

## How to Access It

1. [Step 1 — approved access request or prerequisite]
2. [Step 2 — navigate to the approved location]
3. [Step 3 — sign in using the company-approved method]

> Do not include passwords, PINs, API keys, or confidential access details in this guide.

## How to Complete the Most Common Tasks

### Task 1: [Name]

1. [Step]
2. [Step]
3. [Step]

### Task 2: [Name]

1. [Step]
2. [Step]
3. [Step]

## Data and File Handling

[State the source of truth, data update frequency, storage location, and filing conventions.]

## Troubleshooting and Support

[Describe basic troubleshooting, escalation path, and known limitations.]

## Change Log

| Date | Change | Owner | Approval / Notes |
|---|---|---|---|
| [YYYY-MM-DD] | [Description] | [Name] | [Notes] |
```

---

# 6. Immediate Next Actions

- [ ] Review the **Recommended Company Portfolio** and delete anything that is no longer applicable.
- [ ] Mark each system as **Company-ready**, **Candidate**, **Needs work**, or **Personal only**.
- [ ] Choose the first three Tier 1 projects to organize and document.
- [ ] Create the private master repository and add this file.
- [ ] For each selected project, create a private company repository and add the documentation template.
- [ ] Write the one-paragraph overview for each selected system before writing detailed instructions.
- [ ] Identify where each live portal, source file, and approved company document currently lives.
- [ ] Perform a credential and confidential-data review before pushing any project.
- [ ] Ask management to confirm the desired audience, owners, and access rules for the company master portal.

---

# 7. Project Inventory Table — Fill In During Review

| System / workflow | Include? | Proposed repository | Company owner | Live location | Documentation status | Next action |
|---|---|---|---|---|---|---|
| ApartmentCorp Operations Hub | [ ] | `apartmentcorp-operations-hub` | [Add] | [Add] | [Not started] | [Add] |
| New-Hire Onboarding Ecosystem | [ ] | `apartmentcorp-new-hire-onboarding` | [Add] | [Add] | [Not started] | [Add] |
| Document Hub | [ ] | `apartmentcorp-document-hub` | [Add] | [Add] | [Not started] | [Add] |
| Company Websites Directory | [ ] | `apartmentcorp-company-websites-directory` | [Add] | [Add] | [Not started] | [Add] |
| Admin Portal / Management Dashboard | [ ] | `apartmentcorp-admin-dashboard` | [Add] | [Add] | [Not started] | [Add] |
| Property Directory / Organization Chart | [ ] | `apartmentcorp-property-directory` | [Add] | [Add] | [Not started] | [Add] |
| Property Photo Library | [ ] | `apartmentcorp-property-photo-library` | [Add] | [Add] | [Not started] | [Add] |
| Vacancy & Leasing Report App | [ ] | `apartmentcorp-vacancy-reporting` | [Add] | [Add] | [Not started] | [Add] |
| Operations & Financial Snapshot Dashboard | [ ] | `apartmentcorp-operations-reporting-dashboard` | [Add] | [Add] | [Not started] | [Add] |
| Recurring Reporting Workflow | [ ] | `apartmentcorp-recurring-reporting-workflows` | [Add] | [Add] | [Not started] | [Add] |
| Rent Roll Procedure | [ ] | `apartmentcorp-rent-roll-procedures` | [Add] | [Add] | [Not started] | [Add] |
| Property & Employee Data Maintenance | [ ] | `apartmentcorp-data-maintenance` | [Add] | [Add] | [Not started] | [Add] |
| Vendor Document Generator | [ ] | `apartmentcorp-vendor-document-generator` | [Add] | [Add] | [Review needed] | [Add] |

> **Note for the next revision:** Add any systems not captured here, especially small tools that managers use repeatedly, reports that must continue if one person is unavailable, and workflows that contain company-specific knowledge. Exclude personal-only tools unless management formally requests their transfer.
