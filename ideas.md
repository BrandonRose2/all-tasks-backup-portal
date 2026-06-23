# Manus Task Dashboard — Design Brainstorm

## Three Approaches

### 1. Terminal Noir
Dark command-line aesthetic with monospace type, green-on-black accents, and a hacker-tool feel. Probability: 0.04

### 2. Brutalist Data Grid
Raw, high-contrast layout with thick borders, stark typography, and dense information density. Probability: 0.07

### 3. Executive Intelligence Dashboard ← CHOSEN
A polished, dark-mode command center with deep navy/slate tones, amber accent highlights, and a premium data-forward layout. Probability: 0.09

---

## Chosen Approach: Executive Intelligence Dashboard

**Design Movement:** Dark-mode enterprise data visualization — think Bloomberg Terminal meets Notion AI, with a premium SaaS feel.

**Core Principles:**
1. Data density without clutter — every pixel earns its place
2. Hierarchy through contrast — amber/gold accents on deep slate backgrounds
3. Asymmetric sidebar layout — persistent left nav with content-rich main area
4. Micro-interactions that reward exploration

**Color Philosophy:**
- Background: Deep slate `oklch(0.13 0.015 260)` — not pure black, has depth
- Surface: `oklch(0.18 0.012 260)` — cards and panels
- Accent: Amber gold `oklch(0.78 0.16 75)` — ownable, premium, warm contrast
- Muted: `oklch(0.45 0.01 260)` — secondary text
- Status colors: green (stopped/done), amber (waiting), blue (running)

**Layout Paradigm:**
- Fixed left sidebar (240px) with stats and filters
- Main content area with sticky header search bar
- Card-based task grid with subtle hover lift
- Stats bar across the top of main content

**Signature Elements:**
1. Glowing amber stat cards with subtle gradient borders
2. Animated search bar with instant filter feedback
3. Status badges with pulsing dot for active/waiting tasks

**Interaction Philosophy:**
- Instant search with debounce — no submit button needed
- Filter chips that visually "activate" on click
- Task cards open directly in Manus via external link
- Smooth count transitions when filters change

**Animation:**
- Cards fade+slide in on load (stagger 20ms each)
- Filter changes animate count numbers
- Hover: card lifts 2px with shadow deepening (150ms ease-out)
- Search bar expands subtly on focus

**Typography System:**
- Display: `Space Grotesk` — geometric, modern, distinctive
- Body: `Inter` — readable at small sizes for data
- Mono: `JetBrains Mono` — for IDs and technical values
- Scale: 11px labels → 13px body → 16px headings → 28px stats

**Brand Essence:**
A command center for power users who want instant access to their AI work history. For Brandon at ApartmentCorp. Precise, fast, professional.

**Brand Voice:**
Headlines are terse and direct: "635 Tasks. Every conversation." CTAs are action-first: "Open in Manus →"
No filler copy.

**Wordmark & Logo:**
Stylized "M" mark — angular, geometric, amber on dark slate.

**Signature Brand Color:** Amber gold `oklch(0.78 0.16 75)`

## Style Decisions
- Dark theme throughout — no light mode toggle needed for this internal tool
- Sidebar is fixed, not collapsible, for quick filter access
- Task cards show title, status badge, type, agent, credits, and date at a glance
- "Wide Research Subtask" tasks are visually de-emphasized (muted) since they are system subtasks
