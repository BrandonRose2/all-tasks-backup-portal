# ApartmentCorp Internal App - Replit Agent Prompt

To get the best results from the Replit Agent while minimizing credit usage, it is crucial to provide a structured, incremental prompt. Replit's official best practices recommend planning first, building incrementally, being specific, and keeping the initial request simple [1]. 

Below is a comprehensive, multi-step prompt strategy designed for your boss's ApartmentCorp app. 

## Phase 1: The Initial Setup Prompt
*Copy and paste this into the Replit Agent to start the project. This establishes the core architecture without overwhelming the agent.*

```text
Build a secure, internal company portal for "ApartmentCorp" using React (frontend), Node.js/Express (backend), and PostgreSQL (database). 

Core requirements for this initial build:
1. User Authentication: Implement secure login with role-based access control (Roles: Upper Management, Regional Manager, Property Manager, Assistant, Staff).
2. Dashboard Home Screen: Create a professional landing page that displays a daily "snapshot" of KPIs using graphs and tables (summarizing data from Propertymax and vacancy reports).
3. Navigation: Include a sidebar with links to Dashboard, Communications, Tasks, and IT Support.

Please set up the database schema for users and roles, and build the basic UI layout. Do not add complex features yet.
```

## Phase 2: Communications & Tasks
*Once Phase 1 is working and stable, use this prompt to add the next layer of features.*

```text
Now, let's add the Communications and Task Management modules to the ApartmentCorp portal.

1. Communications (Channels & Message Boards):
- Create a "Channels" feature similar to Slack where users can create and join text-based chat rooms.
- Ensure Upper Management can create private channels to communicate specifically with Regional Managers or other specific roles.
- Add a general "Message Board" for company-wide announcements.

2. Task Management (To-Do's):
- Build a task management system where users can create, assign, and track tasks.
- Tasks should have statuses (To Do, In Progress, Done), due dates, and assignees.
- Ensure the UI is clean and easy to scan.
```

## Phase 3: IT Support & Media Embedding
*After Phase 2 is complete, add the troubleshooting and media features.*

```text
Next, add the IT Support widget and Media Embedding capabilities.

1. IT Troubleshooting Widget:
- Create a persistent "Help/Support" widget or page where staff can submit software issues.
- These tickets should be visible in real-time to a "Developer/IT" role.

2. Media & File Embedding:
- Create a "Resources" or "Knowledge Base" section.
- Allow users to embed external websites, URLs, and YouTube videos.
- Implement file upload capabilities so users can share all types of files (PDFs, documents, images). Use a cloud storage solution like AWS S3 or Cloudinary for file storage.
```

## Phase 4: Advanced KPIs & Integrations
*Finally, implement the complex KPI logic and prepare for external integrations.*

```text
Finally, let's implement the advanced KPI tracking and reporting system.

1. KPI Tracker & Scoring System:
- Build a KPI dashboard specifically for Managers.
- Implement a scoring system that is fair across all properties, factoring in staff size and vacancy rates.
- Include specific point metrics for using "The 5 Golden Questions" and prospect-to-tenant conversion rates.
- Visual Alert System: On the manager dashboard, visually highlight (e.g., flash red at the top) the managers whose dashboards require the most attention (based on higher KPI numbers indicating areas needing immediate tending).

2. External Integrations (API Prep):
- Set up the backend architecture (routes and service files) to prepare for OAuth and API integrations with Microsoft Office 365, Exchange, Notion, and ClickUp. 
- Create a settings page where an admin can input API keys for these services.
```

## Tips for Saving Credits in Replit
1. **Use Checkpoints:** Replit automatically saves checkpoints. If the agent makes a mistake, roll back to the previous checkpoint instead of asking the agent to fix a massive error, which burns credits [1].
2. **Be Specific with Errors:** If something breaks, don't just say "it's broken." Provide the exact error message, the file name, and what you were trying to do [1].
3. **Lower Autonomy (If Available):** If Replit offers an autonomy setting, lowering it can significantly reduce costs by preventing the agent from going down "rabbit holes" trying to fix complex bugs on its own.

## Questions for You Before You Start
To ensure this app perfectly fits ApartmentCorp's needs, I have a few questions:
1. **Data Sources:** You mentioned summarizing data from "Propertymax" and a "vacancy report app." Do these platforms have APIs we can connect to, or will this data be manually uploaded (e.g., via CSV)?
2. **Email Integration:** You have a project rule that emails should be sent from `Brandon@ApartmentCorp.com`. Do you use Office 365 or Google Workspace for this domain? We will need to set up SMTP or an API (like SendGrid or Microsoft Graph) for this.
3. **File Storage:** For uploading "All Types of Files," do you have a preferred cloud storage provider (like AWS S3, Google Cloud Storage, or Azure Blob Storage), or should the agent set up a default one?

---
### References
[1] Replit Docs. "Efficient Prompting." Retrieved from https://docs.replit.com/core-concepts/agent/best-practices
