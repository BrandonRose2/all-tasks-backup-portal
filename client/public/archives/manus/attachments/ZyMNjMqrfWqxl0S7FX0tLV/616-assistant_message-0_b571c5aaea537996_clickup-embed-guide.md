# How to Embed a Web App in ClickUp

This guide shows you how to embed the ApartmentCorp Vacancy Report (or any web app) directly into a ClickUp Space, Folder, or List so your whole team can view it without leaving ClickUp.

---

## What You Need

- A ClickUp **Business plan or higher** (Embed views are not available on Free/Unlimited)
- The URL of the app you want to embed (e.g., `https://apartmentcorpvacancyreport.manus.space`)
- The app must be **publicly accessible** (no login wall blocking the iframe)

> **Good news:** The ApartmentCorp Vacancy Report is already public and embeddable — no changes needed.

---

## Step-by-Step: Embed in a ClickUp Space or List

### Step 1 — Open the Space or List where you want the embed

Navigate to the Space, Folder, or List in your ApartmentCorp ClickUp workspace where you want the dashboard to live (e.g., your main ApartmentCorp Dashboard space).

---

### Step 2 — Add a new View

Click the **"+ Add View"** button in the view bar at the top of the page (next to Board, List, Calendar, etc.).

> If you don't see it, click the **"..."** (More) button at the end of the view bar — it may be hidden.

---

### Step 3 — Select "Embed"

In the view type picker that appears, scroll down and select **Embed**.

| View Type | What it does |
|---|---|
| **Embed** | Loads any URL inside an iframe within ClickUp |
| Board / List / Calendar | ClickUp's native task views — not what you want here |

---

### Step 4 — Paste the URL

A dialog will ask for the URL. Paste:

```
https://apartmentcorpvacancyreport.manus.space
```

Click **Create** or **Confirm**.

---

### Step 5 — Name the view

Rename the view tab to something clear like **"Vacancy Report"** or **"Live Dashboard"** so your team knows what it is.

---

### Step 6 — Done — share with your team

The dashboard will now appear as a tab in that Space/List. Anyone on your ClickUp teamspace with access to that Space can click the tab and see the live dashboard — no login required, data refreshes automatically every 30 minutes.

---

## Repeating This for Other Apps

The exact same steps work for **any web app URL**. The only requirement is that the app is publicly accessible (no login wall). Here's a quick reference:

| App | URL to embed |
|---|---|
| Vacancy Report | `https://apartmentcorpvacancyreport.manus.space` |
| Any future Manus app | Use the `.manus.space` domain shown after publishing |
| External tools (Google Looker Studio, Notion, etc.) | Paste their shareable/embed URL |

---

## Tips & Troubleshooting

**The embed shows a blank page or "Refused to connect"**
The app is blocking iframe embedding (`X-Frame-Options: SAMEORIGIN`). This is common with Google Workspace apps, Salesforce, and some SaaS tools. The ApartmentCorp Vacancy Report does **not** have this restriction — it will load correctly.

**The embed shows a login screen instead of the dashboard**
The app requires authentication. Either make the app public (as done for the Vacancy Report) or use ClickUp's SSO/embed token feature if the app supports it.

**The view doesn't appear in the view bar**
Your ClickUp plan may not include Embed views. Verify you are on Business plan or above under **Settings → Billing**.

**The dashboard looks cramped in the embed**
ClickUp's embed view can be resized. Drag the panel edges wider, or use ClickUp's **Full-screen** button (the expand icon in the top-right of the embed view) to open it full-screen within ClickUp.

**Team members can't see the view**
Check the Space permissions — the Space or Folder may be set to private. Go to **Space Settings → Sharing & Permissions** and ensure all relevant members have at least "View" access.

---

## Recommended ClickUp Structure for ApartmentCorp

| ClickUp Space | Embed Tab Name | URL |
|---|---|---|
| ApartmentCorp Dashboard | Vacancy Report | `https://apartmentcorpvacancyreport.manus.space` |
| ApartmentCorp Dashboard | (future KPI Tracker) | *(URL when built)* |
| ApartmentCorp Dashboard | (future Maintenance Dashboard) | *(URL when built)* |

Keeping all embedded dashboards in a single **ApartmentCorp Dashboard** Space gives your team one place to find all live data without switching between tools.
