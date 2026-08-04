# Referral Flyer Generator v3 — Presentation Script
**Apartment Corp · Internal Team Presentation**

---

## OPENING

*[Open the HTML file in Chrome or Edge before beginning. Have the app visible on screen with Boca Ciega selected as the default property.]*

---

Good [morning/afternoon], everyone. Today I want to walk you through a tool we've built specifically for our team — the **Referral Flyer Generator, Version 3**. This is a single HTML file that lives right on your desktop, requires no internet connection, no software installation, and no design experience. In about 60 seconds, you can produce a print-ready, 8.5 by 11 inch referral flyer for any one of our 43 properties.

Let me show you exactly how it works.

---

## SECTION 1 — WHAT IS IT AND WHY DOES IT EXIST?

Our resident referral program is one of the most cost-effective leasing tools we have. For every qualified referral that moves in and pays full rent on time twice, we credit the referring resident $200 on their tenant ledger. That's a powerful incentive — but only if residents know about it.

The problem we were solving is consistency. In the past, creating a flyer meant opening a design program, swapping out photos, updating phone numbers, and hoping the formatting didn't break. With 43 properties across five regions, that process was time-consuming and inconsistent.

The Referral Flyer Generator eliminates all of that. Every flyer is built from the same professional template — the same one you see in the Walnut Hill example — and it updates automatically based on whichever property you select.

---

## SECTION 2 — THE LAYOUT: A TOUR OF THE SCREEN

*[Point to the left sidebar on screen.]*

When you open the file, you'll see the screen is divided into two areas. On the **left** is your control panel — this is where you make all your selections. On the **right** is the live flyer preview — this updates in real time as you make changes.

Let's go through the control panel from top to bottom.

---

## SECTION 3 — THE PROPERTY DROPDOWN

*[Click the property dropdown to open it.]*

At the top of the sidebar is the **Select Property** dropdown. All 43 of our properties are listed here, organized by region — Region 1 covers Florida and Mississippi, Region 2 covers Ohio, Texas, California, and Missouri, and so on through Region 5 in North Carolina.

*[Select "Walnut Hill" from the dropdown.]*

Watch what happens when I select a property. The flyer preview on the right updates instantly. The property name appears in the logo badge in the top-left corner of the photo. The headline "Love living at Walnut Hill Apartments?" updates in the body. The footer updates with the property name. And — this is the part that saves the most time — the **office phone number auto-populates** from our Notion contact database.

Every manager's direct number and extension is already built in. You don't have to look anything up.

---

## SECTION 4 — THE PHONE NUMBER FIELD

*[Point to the phone number input field.]*

The **Office Phone Number** field sits just below the dropdown. As I just showed you, it fills in automatically when you select a property. But it is fully editable — if a number changes, or if you want to use a different extension, you can simply click in the field and type the update. The flyer reflects the change immediately.

*[Manually edit the phone number and show the flyer updating.]*

This makes the tool flexible for situations like a temporary leasing line or a property that has recently changed management.

---

## SECTION 5 — THE DRAG AND DROP PHOTO ZONE

*[Point to the photo zone in the sidebar.]*

Now here is the feature I'm most excited about — the **Property Photos panel**.

Every flyer needs a photo of the actual property at the top. The app already comes loaded with photos for all 43 properties sourced from Apartments.com and other public listings. But we know that our own photos — taken on-site, professionally shot — are always going to look better.

This is where the drag and drop zone comes in.

*[Demonstrate by dragging a folder of images onto the drop zone.]*

You can drag a single photo, multiple photos, or an **entire folder** of property images directly onto this zone. The app reads every image file in the folder and loads them into a thumbnail grid right here in the sidebar.

Here's the smart part: the app tries to **auto-match** each photo to a property based on the file name. So if you have a file called `walnut_hill_exterior.jpg` or `River Pointe Front.png`, it will automatically assign that photo to the correct property. You'll see a green checkmark badge appear on any thumbnail that has been successfully matched.

*[Point to the thumbnail grid.]*

For any photo that didn't auto-match — maybe the file name is something like `IMG_4872.jpg` — you can click the thumbnail to select it, then use the **"Use Selected Photo for This Property"** button to manually assign it to whichever property is currently selected in the dropdown. It's a two-click process.

Once a photo is assigned, the flyer preview updates immediately with your photo in the banner.

---

## SECTION 6 — THE FLYER DESIGN

*[Scroll or zoom in on the flyer preview.]*

Let's take a moment to walk through the flyer itself, because the design was built to match our established brand standard — the same layout used in the Walnut Hill referral flyer.

Starting at the top: the **property photo** fills a full-width banner. Overlaid on the photo in the top-left is a **logo badge** showing the property name. Across the bottom of the photo, in large bold italic type, is the headline: **"REFER A FRIEND, GET REWARDED!"** — white for the first line, bright green for the second.

Immediately below the photo is a **green banner** reading "Our Resident Referral Program."

The body of the flyer has three key elements. On the left is the **people icon** — a visual of two residents with a heart — paired with the personalized "Love living at [Property Name]?" message. On the right is the **$200 badge**, a bold blue circle that immediately draws the eye to the reward amount.

Below that, on the left, is the **"IT'S EASY!" box** — dark navy background, three numbered steps: Refer, They Apply, You Get $200. On the right is the **Fine Print box**, which clearly states the qualification requirement: the referred resident must pay full rent on time at least twice before the credit is applied.

At the bottom of the flyer is the **green tagline banner** — "Good neighbors make the best community!" — followed by the footer with the megaphone badge, the property name, the office phone number, and the **Equal Housing Opportunity logo**.

Every element is intentional. The flyer is designed to be eye-catching, easy to read, and compliant.

---

## SECTION 7 — PRINTING AND SAVING AS PDF

*[Click the green Print / Save as PDF button.]*

When you're ready to produce the flyer, click the **Print / Save as PDF** button at the bottom of the sidebar.

Your browser's print dialog will open. Here's the important step: in the **Destination** field, select **"Save as PDF"** instead of a physical printer. Make sure the paper size is set to **Letter (8.5 × 11 inches)** and that margins are set to **None**. Then click Save.

You'll have a clean, professional PDF ready to print and distribute — at any quantity, on any printer, at any time.

If you do want to print directly, the same dialog works. Just select your printer instead of Save as PDF. The flyer is formatted to fill the full page with no cropping.

---

## SECTION 8 — WORKFLOW SUMMARY

Let me give you the 60-second version of the full workflow:

1. Open `referral_flyer_generator_v3.html` in Chrome or Edge.
2. Select your property from the dropdown — the phone number fills in automatically.
3. If you have your own property photo, drag it into the photo zone. If not, the app uses the photo already loaded for that property.
4. Confirm the phone number is correct — edit it if needed.
5. Click **Print / Save as PDF**.
6. Print and distribute.

That's it. No design software. No templates to manage. No formatting to fix.

---

## SECTION 9 — IMPORTANT NOTES

A few things worth noting for your records:

**File location:** The app is saved to the `Property Flyers` folder on the shared drive. Keep it there so everyone on the team has access.

**Photos folder:** The app references a `photos` subfolder in the same directory. Do not move the HTML file without also moving the `photos` folder, or the default property images will not load.

**Browser compatibility:** The app works best in **Google Chrome** or **Microsoft Edge**. Internet Explorer is not supported.

**Phone number updates:** If a property's phone number or extension changes, the number in the app can be updated by editing the HTML file directly — or simply type the new number in the phone field each time you generate a flyer for that property.

---

## CLOSING

The Referral Flyer Generator was built to make it easy for every property manager on our team to run a consistent, professional referral program — without needing a graphic designer or a marketing budget. The tool is ready to use today.

If you have questions about how to use it, need a photo updated for a specific property, or want to request any changes to the design or content, please reach out.

Thank you.

---

*[End of presentation script.]*

---

**Document prepared for:** Apartment Corp Internal Team
**Tool version:** Referral Flyer Generator v3
**Date:** June 2026
