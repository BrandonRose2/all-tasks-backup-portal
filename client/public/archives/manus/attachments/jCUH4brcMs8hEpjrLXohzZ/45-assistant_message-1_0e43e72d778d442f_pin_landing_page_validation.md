# GitHub Pages PIN Landing Page Validation

## Target

- Repository: `BrandonRose2/all-tasks-backup-portal`
- Deployment URL: `https://brandonrose2.github.io/all-tasks-backup-portal/`
- Source branch/path: `main` / `/`
- Existing page retained: `Brandon's Tasks Dashboard`

## Local validation performed

The updated `index.html` was opened from the prepared repository workspace using a browser. The first rendered state showed a dark, centered lock-screen card labeled **Case Documentation Portal**, with a four-digit password-style PIN input and an **Unlock case files** button. The existing task dashboard was covered by the fixed access gate.

A deliberately incorrect PIN (`0000`) was entered and submitted. The interface stayed locked and displayed: **“Incorrect PIN. Please try again.”**

The requested PIN (`2597`) was then entered and submitted. The access gate dismissed, the original dashboard became available, and the **Case File Vault** appeared. The vault contained all five requested links:

1. `case-notes-and-strategy.md`
2. `Report_Nicole_Ginger_Sandra_Demotion.pdf`
3. `ApartmentCorp_Indeed_Job_Listing.md`
4. `ApartmentCorp_Indeed_Job_Listing.pdf`
5. `Robert_Sagarang_Case_Monitor_Dashboard.html`

## Security limitation preserved

The page contains a `noindex,nofollow` robots meta tag and a visible note stating that it is a client-side PIN screen on a public static site. The user has been informed that this is a visual gate only; the PIN and direct public file URLs remain inspectable and bypassable on GitHub Pages.

## Live deployment verification

The remote repository was verified after commit `4ad02fbca7b176da78c178b947fd1184fea1bf38` with the subject **Add PIN-protected landing page**. GitHub’s Pages API reported status `built`, an HTTPS-enforced public deployment, and the live URL `https://brandonrose2.github.io/all-tasks-backup-portal/`.

The deployed page was opened using the cache-busting URL `https://brandonrose2.github.io/all-tasks-backup-portal/?v=4ad02fb`. It showed the same centered PIN screen. Entering `2597` on the live deployment dismissed the screen and displayed the Case File Vault with all five requested links. The remote file set was also verified to include `index.html` plus each of the five documentation artifacts.
