# REST API Integration Request — ApartmentCorp Operations Hub
**From:** Brandon Rose, Special Projects — ApartmentCorp  
**To:** PropertyMax.ai Development Team  
**Re:** Read-Only REST API for Manager KPI Dashboard Integration  

---

## Overview

We have built an internal Operations Hub web application at **operationshub-aptcorp.manus.space** that consolidates all of our operational data into one dashboard for our COO and leadership team. We are requesting a **read-only REST API** so our hub can pull live data directly from PropertyMax.ai instead of relying on manual data entry.

The API only needs to **GET (read) data** — we are not asking to write, modify, or delete anything in PropertyMax.ai.

---

## Developer Checklist

Please work through the items below in order. Each section is self-contained.

---

### ✅ STEP 1 — Authentication Setup

- [ ] Create a **dedicated API key** for ApartmentCorp's Operations Hub (read-only access only)
- [ ] Confirm the authentication method: **Bearer Token in the Authorization header**
  - Example: `Authorization: Bearer <API_KEY>`
- [ ] Provide us with:
  - [ ] The **base URL** for all API calls (e.g. `https://api.propertymax.ai/v1`)
  - [ ] Our **API key**
  - [ ] Any **rate limits** we should be aware of (requests per minute/hour)

---

### ✅ STEP 2 — Manager Directory Endpoint

This is the most important endpoint. It powers the **Manager KPI Dashboard**.

**Endpoint:** `GET /managers`

- [ ] Return a list of **all managers** in our account including:

| Field | Type | Example |
|---|---|---|
| `manager_id` | string | `"mgr_001"` |
| `name` | string | `"Blake Weddington"` |
| `role` | string | `"Property Mgr"` or `"Regional Mgr"` or `"Assistant"` |
| `property_name` | string | `"Gates on Manhattan"` |
| `property_id` | string | `"gates"` |
| `region` | string | `"R1"`, `"R2"`, `"R3"`, `"R4"`, or `"R5"` |
| `dashboard_url` | string | Direct URL to their PropertyMax dashboard |
| `last_login` | ISO datetime | `"2026-05-04T09:30:00Z"` |

---

### ✅ STEP 3 — Manager KPI Endpoint

This is the core data feed. It powers every card on the KPI Dashboard.

**Endpoint:** `GET /managers/{manager_id}/kpis`  
*(or a bulk version: `GET /managers/kpis` returning all managers at once — preferred)*

- [ ] For **each manager**, return the following KPI groups:

#### 3a — Tasks (4 values)
| Field | Type | Description |
|---|---|---|
| `tasks_my` | integer | Count of "My Tasks" currently open/pending |
| `tasks_guest_card` | integer | Guest Card tasks open |
| `tasks_maintenance` | integer | Maintenance tasks open |
| `tasks_rent` | integer | Rent-related tasks open |

#### 3b — Appointments (1 value)
| Field | Type | Description |
|---|---|---|
| `appointments` | integer | Scheduled appointments count |

#### 3c — Call Recordings (5 values)
| Field | Type | Description |
|---|---|---|
| `calls_marketing` | integer | Marketing call recordings |
| `calls_urgent` | integer | Urgent call recordings |
| `calls_rent` | integer | Rent-related call recordings |
| `calls_maintenance` | integer | Maintenance call recordings |
| `calls_voicemail` | integer | Voicemail count |

#### 3d — Guest Cards (5 values)
| Field | Type | Description |
|---|---|---|
| `guest_cards_prospects` | integer | Prospect guest cards |
| `guest_cards_tenants` | integer | Tenant guest cards |
| `guest_cards_vendors` | integer | Vendor guest cards |
| `guest_cards_jobs` | integer | Job-related guest cards |
| `guest_cards_other` | integer | Other guest cards |

#### 3e — Performance Score (1 value)
| Field | Type | Description |
|---|---|---|
| `golden_score` | integer (0–100) | Overall performance/Golden Score |

---

### ✅ STEP 4 — Vacancy / Occupancy Endpoint

This powers the **Daily Vacancy Report** and **Home Page Portfolio Overview**.

**Endpoint:** `GET /properties/vacancy`

- [ ] Return one row per property with:

| Field | Type | Description |
|---|---|---|
| `property_id` | string | Unique building ID |
| `property_name` | string | Display name |
| `total_units` | integer | Total unit count |
| `vacant` | integer | Currently vacant |
| `vac_unleased` | integer | Vacant and not leased |
| `vac_preleased` | integer | Vacant but pre-leased |
| `on_notice` | integer | Residents who gave notice |
| `eviction` | integer | Units in eviction process |
| `occupancy_rate` | decimal | e.g. `97.2` |
| `change_vs_yesterday` | integer | Negative = leased, positive = new vacancy |
| `assigned_manager_id` | string | Links back to manager |
| `report_date` | ISO date | `"2026-05-04"` |

---

### ✅ STEP 5 — Marketing / Referral Source Endpoint

This powers the **Marketing Reports** section.

**Endpoint:** `GET /properties/{property_id}/marketing`  
*(with optional query params: `?from=2026-01-01&to=2026-05-04`)*

- [ ] Return referral source counts:

| Field | Type | Description |
|---|---|---|
| `property_id` | string | Building identifier |
| `period_start` | ISO date | Start of reporting period |
| `period_end` | ISO date | End of reporting period |
| `referrals` | array | List of `{ source: string, count: integer }` |

Example `referrals` array:
```json
[
  { "source": "Apartments.com", "count": 42 },
  { "source": "Google", "count": 31 },
  { "source": "Friends & Family", "count": 18 },
  { "source": "Driveby", "count": 12 },
  { "source": "Facebook", "count": 9 },
  { "source": "AffordableHousing.com", "count": 7 }
]
```

---

### ✅ STEP 6 — Response Format Standards

Please follow these standards on **every endpoint**:

- [ ] All responses return **JSON** (`Content-Type: application/json`)
- [ ] Every response includes a top-level **`last_updated`** timestamp in ISO 8601 format
  - Example: `"last_updated": "2026-05-04T14:00:00Z"`
- [ ] All **dates** use ISO 8601 format (`YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`)
- [ ] All **dollar amounts** are numbers, not strings (e.g. `1250.00` not `"$1,250"`)
- [ ] All **percentages** are decimals, not strings (e.g. `97.2` not `"97.2%"`)
- [ ] Return **HTTP 200** for success, **HTTP 401** for invalid API key, **HTTP 404** for not found
- [ ] Wrap all data in a consistent envelope:

```json
{
  "last_updated": "2026-05-04T14:00:00Z",
  "count": 30,
  "data": [ ... ]
}
```

---

### ✅ STEP 7 — CORS Configuration

Our Operations Hub is hosted at:
- `https://operationshub-aptcorp.manus.space`
- `https://aptcorp-dash-jrabqjrz.manus.space`

- [ ] Add both domains to the **CORS allowed origins** list so our web app can call the API directly from the browser
- [ ] Alternatively, confirm if all calls must be **server-to-server** (we can accommodate either)

---

### ✅ STEP 8 — Documentation & Testing

- [ ] Provide a **Postman collection** or **Swagger/OpenAPI spec** so we can test all endpoints before integration
- [ ] Provide at least **one sample response** per endpoint with realistic data
- [ ] Confirm whether there is a **sandbox/test environment** we can use during development

---

## Priority Order

If you need to phase the rollout, please prioritize in this order:

1. **Authentication + Manager Directory** (Steps 1–2) — needed to map managers to their data
2. **Manager KPIs** (Step 3) — the core of the dashboard
3. **Vacancy/Occupancy** (Step 4) — already partially working via our existing Vacancy App
4. **Marketing Referrals** (Step 5) — nice-to-have for Phase 2
5. **Response Standards + CORS** (Steps 6–7) — needed before go-live

---

## Contact

Please reach out with any questions:

**Brandon Rose**  
Special Projects — ApartmentCorp  
brandon@apartmentcorp.com

We are happy to schedule a call to walk through any of these requirements in more detail. Thank you for your support!
