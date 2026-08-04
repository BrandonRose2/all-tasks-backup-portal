# ApartmentCorp API Integration & KPI Tracking Plan

This document outlines the technical architecture and data flow for integrating Propertymax and the Vacancy Report App into the ApartmentCorp internal portal. This integration will power the daily KPI snapshots, manager performance alerts, and automated reporting systems.

## 1. System Architecture & Data Flow

The integration relies on a Node.js/Express middleware layer that acts as the central nervous system. It pulls data from external APIs, normalizes it, calculates the KPI scores, and distributes the data to the frontend dashboards and email systems [1].

![KPI Architecture Diagram](https://private-us-east-1.manuscdn.com/sessionFile/Fl61XFothvpM6ieRQXWNcb/sandbox/YMV6AAL2wRms18qkMAzEqR-images_1778093667956_na1fn_L2hvbWUvdWJ1bnR1L2twaV9hcmNoaXRlY3R1cmU.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRmw2MVhGb3RodnBNNmllUlFYV05jYi9zYW5kYm94L1lNVjZBQUwyd1JtczE4cWtNQXpFcVItaW1hZ2VzXzE3NzgwOTM2Njc5NTZfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwydHdhVjloY21Ob2FYUmxZM1IxY21VLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jmQ3tdxv9dweEbopFJBBoKa2ZsxHVTlp~DRG-ilnOvhC8btYNmBtqy4k8rIg5WEp65ynpLidlOl6F~-2UGQVIEx4gjXL42bsTYxEJO6IapTUPSPdWugOVm7RXWkTjf6oHVpOo1MRODQOATk2mJBQJk~Xn1Bu2YXntelh4tPBBRmTiQtCjcyvDPNnNphc9AmjWkQA6hHLeq5RgtNU~RLy0L8AJNW-xYHalcj1puaQpUl05gyIns7Og90RyiwswHRBCoC~oPKEJBBqBdnFZXbft1G8ACflpsXkD42ZMIJqcI2~c~NkKwaCqgUBWmAZYcly46EQppNYBcf0yIuzyOzLag__)

### 1.1 Data Ingestion Methods
To ensure data is both real-time and reliable, we will use a hybrid approach of webhooks and scheduled polling [2]:

| Source | Method | Frequency | Purpose |
| :--- | :--- | :--- | :--- |
| **Propertymax** | REST API Polling | Daily at 6:00 AM PST | Fetch total units, rent collection rates, maintenance response times, and lease conversions. |
| **Vacancy Report App** | Webhook | Real-time | Instantly notify the system of any status changes (e.g., "New Vacancies" or "Recently Leased"). |
| **Vacancy Report App** | REST API Polling | Daily at 6:00 AM PST | Fallback sync to ensure the "Total Vacant" figure matches exactly before generating the daily report. |
| **Admin UI** | Manual Input | As needed | Allow admins to manually input current values or override data if an API connection fails. |

## 2. KPI Scoring System

The KPI scoring engine is designed to be fair across all properties by normalizing the raw data based on staff size and baseline vacancy rates. The total possible score is 100 points.

![KPI Scoring Diagram](https://private-us-east-1.manuscdn.com/sessionFile/Fl61XFothvpM6ieRQXWNcb/sandbox/YMV6AAL2wRms18qkMAzEqR-images_1778093667956_na1fn_L2hvbWUvdWJ1bnR1L2twaV9zY29yaW5n.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRmw2MVhGb3RodnBNNmllUlFYV05jYi9zYW5kYm94L1lNVjZBQUwyd1JtczE4cWtNQXpFcVItaW1hZ2VzXzE3NzgwOTM2Njc5NTZfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwydHdhVjl6WTI5eWFXNW4ucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fktjAa~wtMSE-eF1u~1HQCePZFy5DnBwkLBZ4~oo8QhOcq6y3NWchj1GUvRzwVMBpjD1Rbc9TXbPw5nkpF6V9cLNgmqOlBoIiZcP-e4mmMUYcT6xn7nL5P7JKp7UfH5jcCmndY3bx7aOXJ~k8mOB6CNVKVM88pJDm3FUxfy8hJV6iCryz-fZ5EkkDNZ69V6QK-yFD249dnXt9jI19fFagBEMalNFX1C3DyNKRrBLI1A~yXVm~wDF3Ix5z0jFm~dwbR~svmtwMmPiQxwkJBG-sEEH73HjsEPC~7L~hV-YPU4wir~~UH8X5PVmoHwnzihW8731TmSYvGWABhCNt54Zbw__)

### 2.1 Metric Breakdown
The raw score is calculated using the following weighted metrics:

1. **Occupancy Rate (25 pts):** The percentage of total units currently leased.
2. **Leasing Conversion (20 pts):** Success rate of converting prospects into tenants.
3. **The 5 Golden Questions (15 pts):** Points awarded based on staff adherence to the 5 Golden Questions protocol during prospect interactions.
4. **Rent Collection Rate (15 pts):** Percentage of total rent collected on time.
5. **Maintenance Response (10 pts):** Average time taken to resolve tenant maintenance tickets.
6. **Tenant Retention (10 pts):** Percentage of tenants renewing their leases.
7. **Vacancy Reduction (5 pts):** Bonus points for a net decrease in vacancies ("Recently Leased") over the month.

### 2.2 Normalization & Alert Tiers
Once the raw score is calculated, the engine applies a **Normalization Factor**. For example, a property with a smaller staff size or historically high vacancy rate receives a slight positive adjustment to ensure fair comparison against larger, fully-staffed properties.

The final adjusted score determines the manager's alert tier:
* **Green (85-100 pts):** On Track. (Represented by a 👍 icon).
* **Yellow (70-84 pts):** Needs Attention.
* **Red Flash (0-69 pts):** Immediate Action Required. (Represented by a 👎 icon). Managers in this tier will have their dashboard modules visually highlighted (flashing red at the top) to indicate areas needing immediate tending.

## 3. Dashboard & Reporting Outputs

The integrated data feeds into several specific outputs required by ApartmentCorp:

### 3.1 The Home Screen Snapshot
Instead of overwhelming users with full KPI data, the home screen will display a daily "snapshot" summarizing data from Propertymax and the vacancy app. This will be presented professionally using clean graphs and tables.

### 3.2 The Vacancy News Ticker
Any real-time changes in building vacancies (triggered by the Vacancy App webhook) will be presented at the top of the dashboard as a scrolling update, similar to a news ticker. This ticker will be positioned carefully so it does not overlap with the main "vacancy changes" section.

### 3.3 Automated Daily Reports
A scheduled cron job will run every day at 6:00 AM PST to generate the "Stay up to Date!" summary. 
* **Format:** Beautiful HTML email.
* **Sender:** `Brandon@ApartmentCorp.com`.
* **Recipients:** All users listed in the Email Recipients Management section of the Admin Tab.
* **Content:** This report will *only* include vacancy data. It will highlight any change in vacancies ("New Vacancies" or "Recently Leased") at the very top of the email, including specific building details. It will also note any significant changes in the Payments section for each building.

## 4. Implementation Steps for Replit

When building this in Replit, follow these technical steps:

1. **Set up Express Middleware:** Create dedicated route files (e.g., `routes/propertymax.js` and `routes/vacancy.js`) to handle the API requests [3].
2. **Configure Webhooks:** Expose a public endpoint (e.g., `POST /api/webhooks/vacancy`) to receive real-time updates from the Vacancy Report App [2].
3. **Implement node-cron:** Use the `node-cron` library to schedule the daily 6:00 AM PST data pull and email generation.
4. **Database Schema:** Ensure the PostgreSQL database has tables for `kpi_snapshots`, `vacancy_log`, and `scoring_records` to store historical data for the charts.

---
### References
[1] Brickwise AI. "How to Integrate Property Management API Step by Step." Retrieved from https://www.brickwiseai.com/blog/how-to-integrate-property-management-api
[2] Merge.dev. "Polling vs webhooks: when to use one over the other." Retrieved from https://www.merge.dev/blog/webhooks-vs-polling
[3] Express.js. "Writing middleware for use in Express apps." Retrieved from https://expressjs.com/en/guide/writing-middleware.html
