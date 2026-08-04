# Outlook Rules Setup Guide
## Auto-Move Promotional & Sales Emails to "Trying to Sell Me Shit"

---

## Step 1: Create the Destination Folder

Before creating rules, you need the target folder to exist.

### In Outlook Desktop (Windows/Mac):
1. In the left sidebar, **right-click** on your **Inbox**
2. Select **"New Folder"**
3. Name it exactly: `Trying to Sell Me Shit`
4. Press **Enter**

### In Outlook Web (outlook.office.com or outlook.com):
1. In the left sidebar, scroll down and click **"New folder"** (or right-click **Inbox**)
2. Name it: `Trying to Sell Me Shit`
3. Press **Enter**

---

## Step 2: Open the Rules Manager

### Outlook Desktop:
1. Click the **Home** tab in the ribbon
2. Click **Rules** → **Manage Rules & Alerts**
3. Click **"New Rule..."**

### Outlook Web:
1. Click the **gear icon** (Settings) in the top-right corner
2. Click **"View all Outlook settings"** at the bottom
3. Go to **Mail** → **Rules**
4. Click **"+ Add new rule"**

---

## Step 3: Create Rule #1 — Catch Sales Keywords in Subject

This rule catches the most common promotional language used in subject lines.

### Outlook Desktop:
1. In the Rules Wizard, select **"Apply rule on messages I receive"** → click **Next**
2. Check **"with specific words in the subject"**
3. Click the **"specific words"** link and add each of the following one at a time:
   - `unsubscribe`
   - `limited time offer`
   - `limited time only`
   - `act now`
   - `don't miss out`
   - `exclusive offer`
   - `special offer`
   - `% off`
   - `save up to`
   - `free trial`
   - `free demo`
   - `book a demo`
   - `schedule a call`
   - `get a quote`
   - `pricing`
   - `upgrade now`
   - `buy now`
   - `shop now`
   - `order now`
   - `flash sale`
   - `clearance`
   - `last chance`
   - `today only`
   - `expires soon`
   - `you're invited`
   - `congratulations, you`
   - `you've been selected`
   - `claim your`
   - `unlock your`
   - `your free`
4. Click **Next**
5. Check **"move it to the specified folder"**
6. Click **"specified"** and select **"Trying to Sell Me Shit"** → click **OK**
7. Click **Next** → **Next** → give the rule a name like `Sales Keywords - Subject`
8. Click **Finish**

### Outlook Web:
1. **Name:** `Sales Keywords - Subject`
2. **Condition:** "Subject includes" → add each keyword listed above
3. **Action:** "Move to" → select `Trying to Sell Me Shit`
4. Click **Save**

---

## Step 4: Create Rule #2 — Catch Sales Keywords in Body

Same as Rule #1 but targets the email body, catching emails where the subject looks innocent but the body is a sales pitch.

### Outlook Desktop:
1. New Rule → **"Apply rule on messages I receive"** → **Next**
2. Check **"with specific words in the message body"**
3. Add the same keyword list as Step 3 above, plus:
   - `click here to unsubscribe`
   - `you are receiving this email because`
   - `to opt out`
   - `manage your preferences`
   - `view in browser`
   - `this is a promotional email`
4. Action: **Move to "Trying to Sell Me Shit"**
5. Name it: `Sales Keywords - Body`

### Outlook Web:
Same process as Step 3, but choose **"Body includes"** as the condition.

---

## Step 5: Create Rule #3 — Catch Common Promotional Sender Domains

Many sales emails come from predictable no-reply or marketing domains. This rule catches them by sender address pattern.

### Outlook Desktop:
1. New Rule → **"Apply rule on messages I receive"** → **Next**
2. Check **"with specific words in the sender's address"**
3. Add the following:
   - `noreply@`
   - `no-reply@`
   - `donotreply@`
   - `marketing@`
   - `promotions@`
   - `newsletter@`
   - `offers@`
   - `deals@`
   - `sales@`
   - `info@` *(optional — only add if your boss doesn't expect legitimate emails from info@ addresses)*
   - `notifications@`
   - `updates@`
4. Action: **Move to "Trying to Sell Me Shit"**
5. Name it: `Promo Sender Addresses`

### Outlook Web:
Choose **"Sender's address includes"** as the condition.

> **Note:** Be careful with `sales@` and `info@` — if your boss has legitimate vendor contacts using those addresses, skip those two to avoid catching real emails.

---

## Step 6: Create Rule #4 — Catch Unread Emails Older Than 30 Days (Manual Sweep)

Outlook Rules don't natively support "never opened" as a condition, but you can do a **one-time manual sweep** for old unread emails.

### In Outlook Desktop:
1. Click on the **Inbox**
2. In the **View** tab, click **"Filter Email"** → **"Unread"** — this filters to show only unread messages
3. Click the **"Received"** column header to sort by date (oldest first)
4. Select all emails older than your cutoff date (e.g., 30–90 days):
   - Click the first old email, then **Shift+Click** the last one to select a range
5. Right-click → **"Move"** → **"Trying to Sell Me Shit"**

### In Outlook Web:
1. Click **"Filter"** at the top of the inbox → select **"Unread"**
2. Sort by **"Oldest"**
3. Select emails using the checkboxes → **Move**

---

## Step 7: Apply Rules to Existing Inbox (Retroactive Cleanup)

After creating the rules, run them against your existing inbox to clean up what's already there.

### Outlook Desktop:
1. Go to **Home** → **Rules** → **Manage Rules & Alerts**
2. Select each rule you just created
3. Click **"Run Rules Now..."**
4. Check **"Inbox"** as the folder to run against
5. Click **"Run Now"**

### Outlook Web:
Outlook Web does not support running rules retroactively. You will need to use the manual sweep method in Step 6 for existing emails, or use the desktop app to run rules retroactively.

---

## Pro Tips

| Tip | Details |
|---|---|
| **Check the folder regularly at first** | For the first week, glance at "Trying to Sell Me Shit" to make sure no legitimate emails got caught. Adjust rules if needed. |
| **Add specific senders as you go** | When a new sales email slips through, right-click it → Rules → "Always move messages from [sender]" → select the folder. |
| **Use "Stop processing more rules"** | In each rule, check this option to prevent emails from matching multiple rules and being processed twice. |
| **Focused Inbox** | If Outlook's Focused Inbox is enabled, also check the "Other" tab — many promos land there and can be bulk-moved. |
| **Sweep tool (Outlook Web)** | Right-click any sender → "Sweep" → "Move all messages from [sender]" — great for one-off bulk cleanup of a specific sender. |

---

## Summary of Rules Created

| Rule Name | Condition | Action |
|---|---|---|
| Sales Keywords - Subject | Subject contains promo keywords | Move to "Trying to Sell Me Shit" |
| Sales Keywords - Body | Body contains promo keywords | Move to "Trying to Sell Me Shit" |
| Promo Sender Addresses | Sender address contains marketing patterns | Move to "Trying to Sell Me Shit" |
| Old Unread Sweep | Manual one-time filter (unread + old) | Move to "Trying to Sell Me Shit" |
