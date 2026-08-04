# Implementing an Automated Feedback & Training Request System
**Prepared by:** Manus AI  
**Prepared for:** Leslie Rolon, Regional Manager  
**Date:** May 27, 2026  

---

## Executive Summary

To streamline the collection of training requests, procedural questions, and operational challenges from property managers, establishing a structured, digital intake pipeline is highly recommended. Given that your organization utilizes a unified Microsoft 365 environment with a shared email structure, you have access to powerful, native tools that integrate seamlessly without requiring external software.

This proposal outlines two optimal strategies for capturing manager feedback and automatically populating a **SharePoint List** (or SharePoint Drive) [1]. Both solutions leverage your existing domain authentication, meaning managers will not need to manually type their names or email addresses—the system will secure and record their identities automatically [2].

---

## Strategic Comparison of Approaches

Before implementing, it is essential to select the architecture that best fits your workflow. The table below compares the two primary Microsoft 365 methods for connecting forms to SharePoint.

| Feature | Approach A: Native SharePoint List Forms | Approach B: MS Forms + Power Automate |
| :--- | :--- | :--- |
| **Setup Complexity** | **Very Low** (Zero-code, built in minutes) | **Medium** (Requires a 3-step Power Automate flow) |
| **User Identity** | Auto-records name and email [2] | Auto-records name and email [2] |
| **File Attachments** | Not natively supported in the form view [1] | Supported (Uploads to OneDrive/SharePoint) [3] |
| **Branching Logic** | No branching (all questions shown) [1] | Supports conditional branching [3] |
| **Data Storage** | Direct to SharePoint List [1] | Form database to SharePoint List via Flow [3] |
| **Data Visibility** | Submitters do not need access to the list [1] | Submitters do not need access to the list [3] |

---

## Approach A: Native SharePoint List Forms (Recommended for Speed)

Microsoft recently introduced a direct integration that allows you to create a web form directly from a SharePoint List [1]. This is the easiest and most secure method if you do not require managers to upload file attachments.

### Step-by-Step Setup Guide

1. **Create the SharePoint List:**
   * Navigate to your SharePoint site, click **New**, and select **List**.
   * You can start with a blank list or use the **Issue Tracker** template.
   * Add columns for the data you want to collect (e.g., "Category" as a Choice column, "Description" as a Multiple Lines of Text column, "Urgency" as a Choice column).

2. **Generate the Form:**
   * In the top ribbon of your SharePoint List, click on the **Forms** button [1].
   * Click **New Form**. The system will automatically generate a clean, responsive web form containing all your list columns [1].

3. **Customize and Share:**
   * Edit the display names of the questions to make them user-friendly (e.g., change the column "Category" to display as "What area does your question relate to?").
   * Copy the generated form link and send it to your managers [1]. 
   * **Note:** Because your team shares the same email domain, the system automatically restricts access to internal users and logs their email and name upon submission [2].

---

## Approach B: MS Forms + Power Automate (Recommended for Attachments)

If you want a highly polished form, need managers to upload screenshots or document examples (such as a lease clause or an unorganized shop photo), or require conditional logic (e.g., showing specific questions only if they select "HUD Files"), you should use **Microsoft Forms** combined with a **Power Automate** cloud flow [3].

```
[Manager Fills MS Form] ──> [Power Automate Trigger] ──> [Creates Row in SharePoint List]
                                                                  │
                                                                  └──> [Saves Attachments to List]
```

### Step-by-Step Setup Guide

1. **Build the Form in Microsoft Forms:**
   * Go to [Microsoft Forms](https://forms.office.com) and click **New Form** [3].
   * Design your questions. To allow attachments, add a **File Upload** question type [3].
   * In the form **Settings** (three dots in the top-right), ensure **"Only people in my organization can respond"** is checked, and make sure **"Record name"** is enabled [2].

2. **Set up the SharePoint Destination:**
   * Create a SharePoint List with columns matching your form questions [3].

3. **Create the Power Automate Flow:**
   * Go to [Power Automate](https://make.powerautomate.com) and select **Create** -> **Automated Cloud Flow** [3].
   * Choose the trigger: **"When a new response is submitted"** (Microsoft Forms) [3].
   * Add the first action: **"Get response details"** (Microsoft Forms) [3].
   * Add the second action: **"Create item"** (SharePoint) and map the form responses to your list columns [3].
   * *(Optional for Attachments)* Add a **Parse JSON** action followed by a **Get file content** and **Add attachment** action to route uploaded files directly to the SharePoint list item [3].

---

## Recommended Form Structure for Leslie's Team

Based on the common issues highlighted in your communication (such as HUD compliance, OneSite, seasonal income calculations, and maintenance organization), here is a tailored blueprint for your form questions:

| Question # | Field Label / Question | Type | Options / Help Text |
| :--- | :--- | :--- | :--- |
| **1** | **Operational Category** | Choice (Single) | <ul><li>Income Calculations (Seasonal, SS, etc.)</li><li>File Compliance (HUD, Tax Credit, Purging)</li><li>Lease & Legal (Move-out charges, Abandonment)</li><li>Software & Systems (OneSite, EIV, HOTMA)</li><li>Maintenance Operations (Shop Organization, Inventory)</li><li>Other General Operations</li></ul> |
| **2** | **Specific Issue or Question** | Long Text | Please describe the situation, procedure, or question in detail. |
| **3** | **Do you require hands-on refresher training?** | Choice (Single) | <ul><li>Yes, I would like individual training.</li><li>Yes, this would be great for a group refresher.</li><li>No, I just need a quick clarification.</li></ul> |
| **4** | **Supporting Document / Screenshot** | File Upload | *Optional:* Upload screenshots of OneSite errors, policy questions, or photos of maintenance shop challenges. |

---

## Best Practices for Managing Submissions

Once the data begins populating your SharePoint List, Leslie can implement these operational workflows to maximize accountability and follow-through:

> **Assign Ownership:** Add an "Assigned To" person column in your SharePoint List. Leslie can assign specific questions to regional trainers, system experts, or maintenance supervisors to address.
>
> **Track Resolution Status:** Use a "Status" column (e.g., *New*, *In Progress*, *Training Scheduled*, *Resolved*) to ensure no manager's question is left unanswered.
>
> **Highlight Urgent Needs:** Create a custom view in SharePoint that highlights unresolved issues or areas with high volume (such as HUD file errors) to prioritize them for the upcoming training sessions.

---

## References

1. SharePoint Maven, *How to save Microsoft Forms Responses to a List in SharePoint*, [https://sharepointmaven.com/how-to-save-microsoft-forms-responses-to-a-list-in-sharepoint/](https://sharepointmaven.com/how-to-save-microsoft-forms-responses-to-a-list-in-sharepoint/)
2. Microsoft Support, *Choose who can fill out a form or quiz*, [https://support.microsoft.com/en-us/education/choose-who-can-fill-out-a-form-or-quiz](https://support.microsoft.com/en-us/education/choose-who-can-fill-out-a-form-or-quiz)
3. Plumsail, *Connect Microsoft Forms to SharePoint using Power Automate*, [https://plumsail.com/blog/connect-microsoft-forms-to-sharepoint-list/](https://plumsail.com/blog/connect-microsoft-forms-to-sharepoint-list/)
