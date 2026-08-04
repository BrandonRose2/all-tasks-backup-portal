# Honest Summary of Manus Mistakes Across All Tasks

**Prepared:** May 8, 2026  
**Account:** PropertyMax.ai / ApartmentCorp Workspace

---

## Overview

After reviewing the full task history, the following is a direct, honest account of the specific mistakes Manus made repeatedly across your workspace — mistakes that wasted your credits and caused frustration. These are not one-off errors; they are **systemic patterns** that recurred across multiple tasks.

---

## Mistake #1: Iterating Through Dozens of Failed Versions Instead of Getting It Right the First Time

**Worst offender: "4 Comparables/Building: Dashboard Widget"**

Manus produced at least **7 failed versions of the same Excel file** (FIXED28 through FIXED35) before the task was completed. In Manus's own words from that task:

> *"I repeatedly applied formatting changes without first doing a complete visual inspection of the target sheet. I would write a script, run it, discover it broke something, patch it, discover another issue, patch again — cycling through FIXED28 through FIXED35 without ever stopping to fully map out what each sheet actually looked like before touching it."*

The root cause was the same each time: Manus blindly copied the layout of one sheet (Boca Ciega, which had a dummy spacer column A) onto other sheets that had a different structure. This 1-column offset caused cascading formatting failures. Rather than diagnosing the root cause once and fixing it properly, Manus patched symptoms repeatedly — each patch revealing a new problem.

**Second worst offender: "Promotional Video for Software YouTube Channel"**

Manus assembled the final video **9 times** (the final deliverable was labeled `assemble9`). The recurring problem was that AI-generated video clips had camera movement (panning and zooming), which caused the TV screens in the video to shift position between frames. Manus then tried to composite static screenshots onto moving screens — a fundamentally flawed approach. The correct solution (generating clips with a fully static, locked-off camera) was not applied until version 9. Every prior version was a credit-consuming failure.

---

## Mistake #2: Failing to Send Email — Every Single Pipeline Run

**Offender: All 5 "How to Run ApartmentCorp Daily Rent Comp Pipeline" tasks (4/22 through 4/26)**

Every single pipeline run ended the same way: Manus completed Steps 1–3 successfully (data refresh, Excel build, ClickUp sync), then **failed at Step 4 (sending the email)** because it could not find Gmail credentials or an active Gmail session. This happened on:

- **4/22** — Failed to send email, asked user to log in to Gmail
- **4/23** — Failed to send email, asked user to log in to Gmail
- **4/24** — Failed to send email, asked user to log in to Gmail
- **4/25** — Failed to send email, asked user to log in to Gmail
- **4/26** — Failed to send email, asked user to log in to Gmail

Manus never resolved the Gmail authentication issue between runs. Each time, it spent credits searching for Gmail MCP configs, OAuth tokens, credential files, and browser sessions — finding nothing — before finally asking the user to intervene. The same dead-end investigation was repeated five times across five separate tasks.

---

## Mistake #3: Fixing Symptoms Instead of Root Causes

This pattern appeared in both the Excel formatting task and the pipeline email task. Rather than identifying and solving the underlying structural problem, Manus applied surface-level patches that temporarily fixed one visible issue while leaving the root cause intact — guaranteeing that the same class of error would reappear.

In the Excel task, Manus admitted:

> *"When the header row colors were wrong, I patched just those cells. When column widths were wrong, I patched just those. Each patch revealed another problem because I never mapped the full structural difference between Boca Ciega and the other sheets upfront."*

In the pipeline task, Manus never resolved the Gmail authentication gap between runs — it simply re-encountered and re-investigated the same missing credentials each time.

---

## Mistake #4: Declaring Work "Done" Without Verifying It

In the Excel formatting task, Manus repeatedly delivered download links and declared files "ready" without first opening them in Excel Online to confirm they looked correct visually. The user had to catch every visual problem themselves. Manus acknowledged this directly:

> *"I delivered download links and declared files 'ready' without opening them in Excel Online first to confirm they looked correct. You had to catch every visual problem yourself."*

---

## Mistake #5: The SharePoint Upload Loop

In the Excel task, Manus spent a large number of steps attempting to upload a file to SharePoint using increasingly complex and ultimately non-functional methods: JavaScript injection, Chrome DevTools Protocol (CDP), xdotool keyboard simulation, and base64 chunking. None of these worked. The correct solution — simply providing a download link for the user to upload manually — took 30 seconds and should have been the first option offered, not the last resort after exhausting every failed approach.

---

## Mistake #6: Scope Creep — Doing Work That Was Not Asked For

In the Excel task, the original request was to restore a "better formatted" version of the file. Manus had already confirmed that FIXED30 was the better version. Instead of simply re-delivering FIXED30, Manus went down a long path **recalculating Market Average values from scratch** — work that was never requested and that introduced new errors into the file.

---

## Mistake #7: Wasting Credits in This Very Task

In the current task (this one), Manus spent a significant number of steps attempting to retrieve task data through the Manus API before pivoting to the browser. Once in the browser, Manus repeatedly failed to navigate to specific tasks, attempted the same search actions multiple times, and took far longer than necessary to gather information that was visible in the sidebar from the start.

---

## Summary Table

| Task | Core Mistake | Times Repeated |
| --- | --- | --- |
| 4 Comparables/Building: Dashboard Widget | Iterating through 7+ failed Excel versions without diagnosing root cause | 7+ versions (FIXED28–FIXED35) |
| Promotional Video for Software YouTube Channel | Regenerating video with wrong camera approach | 9 versions (assemble1–assemble9) |
| ApartmentCorp Daily Rent Comp Pipeline | Failing to send email, re-investigating same missing Gmail credentials | 5 separate task runs |
| 4 Comparables/Building: Dashboard Widget | Attempting non-functional SharePoint upload methods before giving download link | Multiple failed approaches |
| 4 Comparables/Building: Dashboard Widget | Recalculating Market Average when only reformatting was asked | 1 major detour |
| All formatting/delivery tasks | Declaring work done without visual verification | Recurring across tasks |
| This task (Summary of Mistakes) | Looping on failed API/browser navigation before finding data | Multiple wasted steps |

---

## What Should Have Been Done Differently

The single most impactful change would have been: **stop, diagnose fully, then act once** — rather than acting immediately, discovering a problem, patching it, discovering another problem, and repeating. In every major task where credits were wasted, the waste came from iteration on a flawed approach rather than investing time upfront to understand the full picture before writing a single line of code or generating a single video clip.

For the pipeline email failure specifically, the Gmail authentication issue should have been resolved permanently after the first failed run — not re-encountered identically on four subsequent runs.
