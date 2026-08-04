# Summary of Repeated Mistakes and Wasted Credits in Manus Tasks

**Prepared:** May 8, 2026  
**Account:** PropertyMax.ai / ApartmentCorp workspace

---

## Overview

A full review of all tasks in your Manus workspace reveals several clear and costly patterns of repeated failure. The same tasks were restarted multiple times, the same workflows were rebuilt from scratch instead of continued, and the same types of errors recurred across different sessions. The following is an honest, direct account of what went wrong.

---

## 1. The Single Biggest Problem: Repeatedly Starting New Tasks Instead of Continuing Existing Ones

This is the root cause of most wasted credits. Rather than continuing a conversation within an existing task (which costs far fewer credits), a new task was created each time something did not work. This means the full credit cost of initializing a new agent session was paid every single time.

The following task titles appear **multiple times** in your task list, confirming this pattern directly:

| Task Title | Times Repeated |
| --- | --- |
| How to Run the ApartmentCorp Daily Rent Comp Pipeline | **6 times** (also appears as "How to Run ApartmentCorp Daily Rent Comp Pipeline") |
| Explore YouTube Channel and Suggest Top 3 Videos | **2 times** |
| How to Run the ApartmentCorp Daily Rent Comp Pipeline (variant) | Multiple variations with slightly different titles |
| Generate and Email PHA Payment Standards Report | Appears as: "How to Run and Email the PHA Payment Standards Report," "Daily PHA Payment Standards Report Process," "PHA Payment Standards Email Report for Apartment Corp," "How to Generate and Send PHA Payment Standards Report" — **at least 5 variations** |

Every single one of these repeated tasks consumed a full credit allocation to start, even though the underlying goal never changed. This is the most direct and measurable source of wasted credits.

---

## 2. The PHA Payment Standards Report: Five Separate Tasks for One Workflow

The following tasks are all attempting to accomplish the same thing — generating and emailing a PHA Payment Standards report:

1. **How to Run and Email the PHA Payment Standards Report**
2. **Daily PHA Payment Standards Report Process**
3. **Generate and Email PHA Payment Standards Report**
4. **PHA Payment Standards Email Report for Apartment Corp**
5. **How to Generate and Send PHA Payment Standards Report**

Instead of completing this workflow once and saving it as a reusable process (e.g., via a scheduled task or a saved prompt), a new task was started each time the previous attempt either failed or was unclear. Each new task required the agent to rediscover context, re-read files, and re-attempt the same steps — all at full credit cost.

---

## 3. The ApartmentCorp Daily Rent Comp Pipeline: Six Separate Tasks

The following tasks are all attempting to run the same pipeline:

1. **How to Run the ApartmentCorp Daily Rent Comp Pipeline** (first instance)
2. **How to Run the ApartmentCorp Daily Rent Comp Pipeline** (second instance — duplicate title)
3. **How to Run ApartmentCorp Daily Rent Comp Pipeline** (slight title variation)
4. **How to Run ApartmentCorp Daily Rent Comp Pipeline** (another instance)
5. **How to Run the ApartmentCorp Daily Rent Comp Pipeline** (another instance)
6. **How to Run ApartmentCorp Daily Rent Comp Pipeline** (another instance)

Six separate task initializations for one recurring workflow. This is the clearest example of credit waste in the entire account. A workflow that should have been built once, tested, and then scheduled or documented was instead rebuilt from scratch six times.

---

## 4. Failure to Use Scheduled Tasks for Recurring Workflows

Both the PHA Payment Standards Report and the Daily Rent Comp Pipeline are **recurring, daily workflows**. Manus has a built-in **Scheduled Tasks** feature (visible in the left sidebar as "Scheduled") that allows recurring tasks to run automatically without human re-initiation. This feature was never used for these workflows. Instead, the same task was manually restarted each time, consuming full credits on every run.

---

## 5. Failure to Retain Context Between Sessions

When a task failed or produced an incomplete result, the correct action is to **send a follow-up message within the same task** to correct or continue the work. Instead, a brand new task was started each time. This means:

- The agent had no memory of what was already tried.
- Files and context had to be re-uploaded or re-referenced.
- The same dead ends were explored repeatedly.
- Credits were spent re-doing work that had already been partially completed.

---

## 6. Duplicate Exploratory Tasks

The following exploratory tasks were also repeated unnecessarily:

- **"Explore YouTube Channel and Suggest Top 3 Videos"** — appears twice with nearly identical titles. The second task produced the same type of output as the first, meaning the first result was either lost or ignored.
- **"How to Integrate Slack with ClickUp and Manus"** and **"How to Create a Channel and Integrate Slack in ClickUp"** — these are the same integration question asked in two separate tasks.
- **"Separate Mortgage Statements into Individual Files"** and **"How to File Multiple Mortgage Statements in PsiSafe?"** — both address the same mortgage document workflow.

---

## 7. This Very Task: Wasted Credits During Execution

Even this current task — the summary of mistakes — has itself demonstrated the same pattern. During execution, the agent:

- Spent multiple steps searching for a Manus API key that does not exist in the sandbox environment, rather than immediately using the browser to access the task list.
- Navigated to the Manus app multiple times unnecessarily (at least 4 separate page loads of the same URL).
- Attempted to parse HTML files for task IDs using an approach that was unlikely to work with a JavaScript-rendered app, rather than reading the already-visible task list from the page content.
- Scrolled and re-viewed the same page multiple times without extracting new information.

This is a direct example of the same problem: repeating the same failing action instead of pivoting to a working approach.

---

## Summary Table of Repeated Mistakes

| Mistake | Impact | How to Fix |
| --- | --- | --- |
| Starting a new task instead of continuing an existing one | Highest credit waste — full session cost each time | Always send a follow-up message in the existing task |
| Running recurring workflows manually instead of scheduling them | Daily credit waste for PHA report and Rent Comp pipeline | Use the Scheduled Tasks feature in Manus |
| Repeating the same task 5–6 times (Rent Comp Pipeline, PHA Report) | Massive credit waste — 5–6x the necessary cost | Build the workflow once, document it, then schedule or reuse it |
| Duplicate exploratory tasks (YouTube, Slack, mortgage docs) | Moderate credit waste | Check existing task history before starting a new task |
| Agent re-exploring failed approaches without pivoting | Moderate credit waste within individual tasks | Provide clearer instructions; stop and redirect the agent sooner |

---

## Recommendations

**Immediate actions to stop the bleeding:**

1. Use the **Scheduled Tasks** feature for the Daily Rent Comp Pipeline and PHA Payment Standards Report. These should run automatically, not be manually re-triggered.
2. Before starting any new task, **check the task list** to see if the same task already exists and can be continued.
3. When a task fails, **send a follow-up message in the same task** rather than starting a new one.
4. For recurring workflows, create a **saved prompt or project** in Manus so the agent always has the correct context without needing to rediscover it.
5. If a task is not producing results after 2–3 attempts within a session, **stop the agent and provide more specific instructions** rather than letting it continue consuming credits on failed approaches.
