# Portfolio Recovery Audit

## Scope

This audit was performed after the user reported that earlier project edits appeared to be missing and that pages they had removed had reappeared. No further publishing changes are to be made until the desired project catalog is reconciled.

## Repository findings

| Snapshot | Project count | Removed relative to next snapshot | Added relative to next snapshot | Notes |
|---|---:|---|---|---|
| `c10e7bc` | 21 | None | `peptides-webapp` added later | Early portfolio source snapshot |
| `c9322fe` | 22 | None | None | Carousel/music expansion snapshot |
| `ca38998` (current) | 22 | None | None | Only `vacancy-report.previewStyle` changed |

The repository-level comparison found **no removed projects** between the carousel expansion snapshot and the current published version. The only current `projects.json` change after that snapshot is the dedicated `previewStyle: "vacancy-dashboard"` setting for Vacancy Report.

## Local edit behavior

The site intentionally stores Edit Mode project changes in the browser's local storage under `portfolio_projects_v1`. When that key exists, the site loads the entire local draft instead of `projects.json` from GitHub Pages. These browser-local edits are not automatically committed or shared with visitors; they must be exported as `projects.json` and deliberately published.

The user’s My Browser showed the default soundtrack draft and the owner editor. A non-destructive `Export projects.json` action was invoked to create a backup of the browser-local project draft. The browser session disconnected before the downloaded backup could be retrieved into the sandbox.

## Likely explanation

The reported missing/returned pages are most likely the difference between a browser-local project draft and the published `projects.json` catalog, rather than a repository deletion. Recovery requires the exported local `projects.json` (or a user-provided list of desired additions/removals/URLs) before any restoration can safely be published.

## Safeguard for next change

Do not overwrite or publish `projects.json` again until the user’s exported local project draft has been reviewed and compared against the live catalog.

## Music note

The published configuration contains the requested Spotify artist URL. Spotify/browser autoplay restrictions can still prevent sound until a user interaction; the current controller is loaded invisibly for visitors but must be further diagnosed independently of catalog recovery.

## Soundtrack diagnostic

The public page correctly creates a hidden Spotify iframe using the configured artist URL, but a browser-driven probe after a visitor-style click showed only the Spotify iframe API resources and no actual audio/media resources. The configured link is an **artist page**, not a playable track, album, or playlist context. Spotify’s documentation further notes that programmatic playback without user interaction is not supported for all browsers and users.

A reliable visitor-facing background soundtrack needs a specific Spotify **track, album, or playlist** URL. Even then, browser and Spotify policies may require a user gesture before audible playback can begin. The current artist URL can remain an owner configuration value, but it cannot be depended on to begin background music for visitors.

Source: Spotify iFrame API documentation, accessed 2026-08-05: https://developer.spotify.com/documentation/embeds/references/iframe-api
