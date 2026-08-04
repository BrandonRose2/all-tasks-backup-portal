# PropertyMax.ai Server-Side Remediation Design

**Purpose:** Prevent a Narrative submission from creating a duplicate Vacancy Summary record for an existing physical unit, even when managers use different display text or the browser retries a save.

**Important implementation boundary:** This design is based on the authenticated audit of the PropertyMax client workflow. It uses the observed fields `occupancy_sid`, property selection, and `GetSummaryDetails`, but database and server method names below are illustrative. The implementation team should map the proposed structures to the actual ColdFusion/SQL schema rather than assume table names.[1]

## 1. The design principle

The server must treat a **property-scoped unit ID** as the identity of a physical apartment. `2102 Breckenridge`, `2102Breckenridge`, and `Unit 2102` are merely display strings; they are never sufficient as the final identity key.

A Narrative vacancy line must take exactly one of three paths:

| Input condition | Server action | Result |
|---|---|---|
| The request contains an existing `summary_sid`. | Verify ownership and update that exact Summary row. | No match-by-text is performed. |
| The request has no `summary_sid`, but the unit resolves unambiguously to the property’s unit master. | Locate the current Summary row for that canonical `unit_id`; update/link it if found. | A formatting variation cannot create a duplicate. |
| The request has no `summary_sid` and the unit is unknown or ambiguous. | Reject the line with a structured error, or require an authorized “new unit” exception. | The server never guesses and never silently inserts. |

> A client can help the manager choose a unit, but **the server must enforce the rule**. Any browser-side validation can be bypassed or may fail during a retry.

## 2. Data model changes

The durable fix requires four concepts: a canonical property-unit directory, a current Summary row, a source-link record, and an immutable event history.

### 2.1 Canonical property-unit directory

| Suggested field | Purpose | Constraint |
|---|---|---|
| `unit_id` | Stable identifier for the physical unit. | Primary key. |
| `property_id` | The building/property owning the unit. | Required; indexed with `unit_id`. |
| `canonical_label` | Preferred display label, for example `2102B`. | Required. |
| `lookup_key` | Conservative normalized representation used only for candidate search. | Indexed; not globally unique. |
| `is_active` | Whether this is a current unit in the property inventory. | Required. |
| `created_at`, `updated_at` | Audit and maintenance metadata. | Required. |

Create a separate `property_unit_alias` table for known historical or manager-friendly labels. An alias record maps a specific property plus alias text to one `unit_id`. This is safer than globally stripping spaces or hyphens because `202-A` and `202A` may be distinct in one property and aliases in another.

```text
property_unit
  unit_id (PK)
  property_id (FK)
  canonical_label
  lookup_key
  is_active

property_unit_alias
  alias_id (PK)
  property_id (FK)
  alias_label
  alias_lookup_key
  unit_id (FK)
  approved_by
  approved_at
```

The database should enforce uniqueness at least on `(property_id, canonical_label)` after the data cleanup. It should also enforce a unique alias lookup key within a property when the business approves it as unambiguous.

### 2.2 Vacancy Summary identity

Add `unit_id` to the existing Vacancy Summary record. Retain the legacy raw unit text for history and display, but progressively make `unit_id` mandatory for active records.

| Suggested field | Purpose |
|---|---|
| `summary_sid` | Existing Summary record primary key. |
| `property_id` | Existing property/building reference. |
| `unit_id` | Canonical property-unit identity. |
| `unit_display` | The current displayed label; not an identity key. |
| `is_current` | Indicates the current operational vacancy/status record for a unit. |
| `source_type` | `NARRATIVE`, `VACANCY_MANUAL`, `MIGRATION`, or another approved source. |
| `last_source_event_id` | Fast trace to the latest narrative/manual event. |

Most operations need one active/current Summary record per property unit, not one record forever. A unit can become vacant, rent, and become vacant later; that is a new **vacancy cycle**, not a duplicate. Use either an explicit `vacancy_cycle_id` or an `is_current` flag to distinguish history from the current state.

Conceptual database constraint:

```sql
-- Syntax varies by database. Implement the equivalent supported by the production engine.
UNIQUE (property_id, unit_id) WHERE is_current = 1;
```

If the production database cannot support a partial unique index, enforce the same rule through a small `current_unit_state` table keyed by `(property_id, unit_id)` and lock that row during writes.

### 2.3 Narrative-to-Summary source link

Create a dedicated association table. This is the crucial idempotency layer.

```text
narrative_summary_link
  link_id (PK)
  narrative_id
  narrative_line_id
  summary_sid
  property_id
  unit_id
  source_type              -- NARRATIVE_VACANCY, NARRATIVE_MOVE_IN, etc.
  idempotency_key
  created_at
  updated_at
```

The key constraint is:

```sql
UNIQUE (narrative_line_id, source_type)
UNIQUE (idempotency_key)
```

The best implementation uses a real immutable `narrative_line_id` UUID stored with each line in the Narrative itself and rendered as a hidden field on later edits. If the current Narrative schema only stores repeated form arrays, add this field before enforcing strong idempotency.

A temporary fallback is `narrative:{narrative_id}:vacancy:{line_ordinal}:revision:{revision}`. It is acceptable only during a transition because managers can reorder or delete/re-add rows; a durable line UUID is safer.

### 2.4 Immutable history

Write an append-only `vacancy_summary_event` row for every insert, update, link, manual change, conflict, and merge. Store the before/after fields, actor, source, and transaction/request ID. This permits a future auditor to answer, “Which narrative caused this change?” without inferring from dates and notes.

## 3. Required server endpoint contract

Whether the current handler remains `POST /app/narratives/new/` or moves to a CFC method, the server should internally receive normalized structured lines, not only parallel form arrays.

```json
{
  "narrative_id": 8430,
  "property_id": 123,
  "request_id": "6de64b7b-3ddb-4d82-9f4f-dc7f0e801c55",
  "vacancies": [
    {
      "narrative_line_id": "8b78e29f-8c3d-4b68-a8b7-0962355e6020",
      "summary_sid": 47219,
      "unit_id": 5561,
      "unit_display": "1713",
      "status_id": 1,
      "move_out_date": "2026-07-13",
      "beds": 2,
      "rent_ask": 1200,
      "rent_ready_pct": 0,
      "note": "Not leased"
    }
  ]
}
```

The client may continue posting `occupancy_sid` during rollout, but it must not be trusted without verification. `property_id`, user identity, and permission must come from the authenticated server session or be validated against it.

A successful response should report the outcome of each line so the UI can explain what happened:

```json
{
  "ok": true,
  "results": [
    {
      "narrative_line_id": "8b78e29f-8c3d-4b68-a8b7-0962355e6020",
      "summary_sid": 47219,
      "unit_id": 5561,
      "action": "UPDATED_EXISTING",
      "idempotent_replay": false
    }
  ]
}
```

## 4. Transaction flow

The complete save of a Narrative and its linked vacancy lines should execute as one database transaction, or use a transactional outbox if email/report processing must occur asynchronously. Do **not** write the Narrative first and synchronize summary rows later without a durable link, because a retry can then create a second Summary row.

```text
BEGIN TRANSACTION

1. Authenticate the actor and validate access to property_id.
2. Lock the narrative record for this save/revision.
3. For each submitted narrative vacancy line:
   a. Validate fields, statuses, and dates.
   b. Derive a stable source key / narrative_line_id.
   c. Check narrative_summary_link by source key.
      - If a link already exists, load its summary_sid.
      - Apply the requested update to that exact Summary row.
      - Record an idempotent replay if the request is unchanged.
   d. Otherwise, if summary_sid was submitted:
      - Load it with a row lock.
      - Verify summary.property_id equals selected property_id.
      - If unit_id is submitted, verify it equals summary.unit_id.
      - Update the exact record and create the source link.
   e. Otherwise, resolve the unit against property_unit and aliases.
      - One candidate: lock the current state for (property_id, unit_id).
      - Zero candidates: reject with UNIT_NOT_FOUND unless authorized exception flow applies.
      - Multiple candidates: reject with UNIT_AMBIGUOUS and return choices.
   f. After resolving a unit_id, locate/lock the current Summary row.
      - Existing current row: update it and create source link.
      - No current row: create exactly one current Summary row, then create source link.
   g. Append a vacancy_summary_event history row.
4. Save the Narrative revision and its line IDs.
5. Commit.

If any line cannot be safely resolved, roll back the entire transaction or return a deliberate partial-save response with no Summary writes. For weekly manager reporting, all-or-nothing is generally safer.
COMMIT
```

The key implementation detail is that the link lookup occurs **before** any decision to insert. A browser retry therefore finds the original link and becomes an update/no-op instead of a new record.

## 5. Unit-resolution rules

The resolver should be conservative. It should never use a single global `replace(' ', '')` rule as the final decision.

| Resolution step | Rule | Outcome |
|---|---|---|
| 1 | A valid, property-owned `unit_id` is supplied. | Use it; do not match text. |
| 2 | A valid `summary_sid` is supplied. | Use its stored `unit_id` after property ownership validation. |
| 3 | Exact canonical label match within the selected property. | Resolve to one unit. |
| 4 | Exact approved alias match within the selected property. | Resolve to one unit. |
| 5 | Conservative lookup-key match. | Auto-resolve only if one approved candidate exists. |
| 6 | No candidates or multiple candidates. | Return a structured error and require a selection or exception. |

A conservative lookup key can uppercase, trim outer whitespace, collapse consecutive spaces, and remove a literal `UNIT` prefix. It should retain semantically meaningful suffixes such as `A`, `B`, and building identifiers unless that specific property’s alias directory says otherwise.

Examples:

| Typed text | Canonical label | Automatic result |
|---|---|---|
| `2102 Breckenridge` | `2102Breckenridge` | Resolve only if an approved alias or unique property-specific lookup match exists. |
| `1526 V` | `1526V` | Resolve only if the unit directory confirms they are the same unit. |
| `202-A` | `202A` | Require an alias or manager selection; do not assume punctuation is insignificant. |
| `2102 Lafayette` | `2102Breckenridge` | Do not merge; these could be distinct physical identifiers. |

## 6. Pseudocode for the ColdFusion save handler

The following is intentionally pseudocode rather than copy-paste production code. It illustrates the required ordering and validation.

```cfml
function saveNarrativeVacancy(required struct request, required struct sessionUser) {
    validatePropertyAccess(sessionUser.userId, request.property_id);

    transaction isolation="serializable" {
        narrative = lockNarrative(request.narrative_id);

        for (line in request.vacancies) {
            validateVacancyLine(line);
            lineId = ensureImmutableNarrativeLineId(narrative, line);
            idempotencyKey = "N:" & narrative.id & ":L:" & lineId & ":V";

            existingLink = lockNarrativeSummaryLink(idempotencyKey);
            if (!isNull(existingLink)) {
                updateSummary(existingLink.summary_sid, line, source="NARRATIVE");
                writeSummaryEvent(existingLink.summary_sid, line, action="IDEMPOTENT_UPDATE");
                continue;
            }

            if (len(trim(line.summary_sid))) {
                summary = lockSummary(line.summary_sid);
                assert(summary.property_id == request.property_id, "SUMMARY_PROPERTY_MISMATCH");
                if (len(trim(line.unit_id))) {
                    assert(summary.unit_id == line.unit_id, "SUMMARY_UNIT_MISMATCH");
                }
                updateSummary(summary.summary_sid, line, source="NARRATIVE");
                createNarrativeSummaryLink(idempotencyKey, narrative.id, lineId, summary.summary_sid);
                writeSummaryEvent(summary.summary_sid, line, action="UPDATED_BY_SID");
                continue;
            }

            unit = resolvePropertyUnit(request.property_id, line.unit_id, line.unit_display);
            assert(unit.status != "NOT_FOUND", "UNIT_NOT_FOUND");
            assert(unit.status != "AMBIGUOUS", "UNIT_AMBIGUOUS", unit.candidates);

            lockCurrentUnitState(request.property_id, unit.unit_id);
            summary = findCurrentSummary(request.property_id, unit.unit_id, forUpdate=true);

            if (isNull(summary)) {
                summary = createCurrentSummary(request.property_id, unit.unit_id, line, source="NARRATIVE");
                action = "CREATED_AFTER_CANONICAL_RESOLUTION";
            } else {
                updateSummary(summary.summary_sid, line, source="NARRATIVE");
                action = "UPDATED_AFTER_CANONICAL_RESOLUTION";
            }

            createNarrativeSummaryLink(idempotencyKey, narrative.id, lineId, summary.summary_sid);
            writeSummaryEvent(summary.summary_sid, line, action=action);
        }

        saveNarrativeRevision(narrative, request);
    }
}
```

The handler must catch duplicate-key errors from the unique idempotency or current-unit-state constraint. On a race, it should reload the winning link/row and return an idempotent success if the request represents the same narrative line; otherwise it should return a conflict rather than silently overwrite another user’s change.

## 7. Error handling and user-visible responses

| Error code | Server condition | Correct user-facing behavior |
|---|---|---|
| `SUMMARY_PROPERTY_MISMATCH` | A submitted `summary_sid` belongs to a different property. | Block save and log a security/audit event. |
| `SUMMARY_UNIT_MISMATCH` | The client claims a unit ID that conflicts with the Summary row’s unit ID. | Block save; do not change the Summary row. |
| `UNIT_NOT_FOUND` | No approved property-unit or alias match exists. | Ask the manager to choose a unit or request a unit-directory addition. |
| `UNIT_AMBIGUOUS` | More than one approved candidate matches the typed text. | Show matching units and require explicit selection. |
| `IDEMPOTENCY_CONFLICT` | Same narrative line was previously linked to a different Summary row. | Reload the saved narrative line and resolve as an administrator-level conflict. |
| `CURRENT_UNIT_CONFLICT` | Concurrent write encountered a different active Summary record. | Reload current data and request manager review; do not insert another row. |

The server response should preserve the typed display string and candidate options so the manager can correct a line without reentering the entire weekly narrative. It should not merely return “duplicate” because the manager needs to know which existing Summary record will be updated.

## 8. Concurrency and retry protection

A duplicate can arise even if the user never types an alternate label. For example, two browser requests may arrive after a double-click, network timeout, or automatic retry. Client-side button disabling is helpful but insufficient.

The database should provide the final guarantee through both a unique idempotency key and a unique current-unit-state constraint. Use one of these patterns depending on the production database:

| Database capability | Preferred implementation |
|---|---|
| Partial unique indexes | `UNIQUE(property_id, unit_id) WHERE is_current = 1`, plus unique `idempotency_key`. |
| No partial unique indexes | A `current_unit_state(property_id, unit_id, summary_sid)` table with `UNIQUE(property_id, unit_id)` and row locks. |
| Serializable transactions available | Use `SERIALIZABLE` around link lookup, state lock, Summary write, and link insert. |
| Lower isolation only | Use explicit row-level locking plus duplicate-key conflict handling and retry once. |

The transaction must include the Narrative-source link insertion. If the link is written after the Summary insert in a separate transaction, a retry in the gap can still create a duplicate.

## 9. Deployment and data-repair sequence

Do not start by merging duplicates. First prevent new duplicates, then repair history with an auditable queue.

| Phase | Server change | Safety gate |
|---|---|---|
| 1. Observe | Add event logging and source-link tables; write lineage in shadow mode. | Compare proposed matches with current behavior; do not block managers yet. |
| 2. Resolve | Add property-unit directory and approved aliases for the affected properties. | Review all ambiguous/unknown results with operations. |
| 3. Enforce | Require `unit_id` or a validated `summary_sid`; activate idempotency and current-state constraints. | Regression tests pass for prefilled, blank, retry, and ambiguous cases. |
| 4. Improve UX | Add unit picker, match preview, and explicit new-unit exception flow. | Manager acceptance testing confirms the workflow is understandable. |
| 5. Repair | Generate a candidate duplicate queue and merge only approved pairs. | Back up data; preserve Summary history and all narrative links. |

For legacy cleanup, use `property_id + resolved unit_id + overlapping current status/cycle` to identify candidates. Do not auto-merge based only on normalized text. A record can represent a legitimate later vacancy cycle, and some similar labels are genuinely distinct.

## 10. Acceptance tests

The deployment should not be considered complete until these tests pass in a staging copy of production data.

| Test case | Required outcome |
|---|---|
| Narrative preloads unit `1713` with a valid `occupancy_sid`; manager saves. | Same Summary ID is updated; no second `1713` is inserted. |
| A blank-SID line is typed as `2102 Breckenridge` while `2102Breckenridge` is a known alias/canonical unit. | The server resolves the unit and updates/links the current row, not inserts. |
| A blank-SID line is `202-A` and the directory has both `202-A` and `202A`. | The server returns `UNIT_AMBIGUOUS` and makes no Summary write. |
| Same HTTP request is replayed twice. | Exactly one Summary/source-link pair exists; the second request is an idempotent success. |
| Two managers submit a new vacancy for the same unit concurrently. | At most one current Summary row exists; the loser receives a conflict or updates the winner as permitted. |
| An altered client sends a `summary_sid` from another property. | Server rejects it and logs the attempt; no cross-property update occurs. |
| A truly new, authorized unit is added. | It is entered in the property unit directory first, then one Summary row and one narrative link are created. |

## 11. What to build first

The lowest-risk first release is: **(1)** add the Narrative-to-Summary link table with a unique idempotency key; **(2)** require the server to honor and validate existing `occupancy_sid` values; and **(3)** block blank-SID inserts when a candidate current unit exists. This immediately eliminates the most likely duplicate path without forcing every manager workflow to change on day one.

The durable second release is the property-unit picker and canonical `unit_id` model. That replaces ambiguity with a proper domain identity and makes future report integrations, imports, dashboards, and audits substantially more reliable.

## References

[1]: https://propertymax.ai/app/narratives/new/ "PropertyMax.ai — Weekly Narrative / New (authenticated client-source inspection)"
[2]: https://propertymax.ai/vacancy.cfc?method=getsummary&regionid=2 "PropertyMax.ai — Region 2 Vacancy Summary (authenticated inspection)"
[3]: https://propertymax.ai/app/narratives/view/?id=8428 "PropertyMax.ai — Breckenridge Narrative 8428 (authenticated inspection)"

---

Prepared by **Manus AI** as an implementation design based on the July 17, 2026 read-only audit.
