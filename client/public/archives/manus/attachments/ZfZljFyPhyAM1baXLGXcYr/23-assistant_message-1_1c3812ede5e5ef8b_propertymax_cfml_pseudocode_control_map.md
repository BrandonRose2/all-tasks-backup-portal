# PropertyMax CFML Pseudocode Control Map

| Pseudocode stage | Control enforced | Duplicate or data-integrity failure prevented |
|---|---|---|
| `validatePropertyAccess` | Authenticated actor may write only to allowed properties. | A user or altered request updating another property’s vacancy row. |
| `transaction isolation="serializable"` | All reads, locks, Summary writes, and source links commit together. | Two concurrent requests both concluding that no row exists and both inserting one. |
| `lockNarrative` and stable `narrative_line_id` | A narrative line has durable identity across edits and retries. | A double-submit or retry being treated as a new line. |
| `lockNarrativeSummaryLink` | A prior narrative-to-Summary relationship is checked before every insert decision. | Replay of an already-processed narrative line creating another Summary row. |
| `summary_sid` validation | Existing Summary row is updated by its primary key after property/unit validation. | Text changes being allowed to redirect an update or create a replacement row. |
| `resolvePropertyUnit` | Blank-SID typed text resolves to a property-scoped canonical unit, an explicit exception, or an error. | `2102 Breckenridge` bypassing `2102Breckenridge` because the display strings differ. |
| `lockCurrentUnitState` | Serializes the create-or-update decision for one property/unit. | Simultaneous creates for the same valid unit. |
| `createNarrativeSummaryLink` with unique idempotency key | Persists the source relationship atomically with the Summary change. | Network retry, browser refresh, queue replay, or duplicate POST producing extra rows. |
| `writeSummaryEvent` | Keeps immutable lineage for each action. | Later inability to distinguish valid updates from true duplicates. |
| duplicate-key catch and reload | Treats the winning concurrent transaction as authoritative. | Error handling that retries a failed insert and accidentally creates another row. |
