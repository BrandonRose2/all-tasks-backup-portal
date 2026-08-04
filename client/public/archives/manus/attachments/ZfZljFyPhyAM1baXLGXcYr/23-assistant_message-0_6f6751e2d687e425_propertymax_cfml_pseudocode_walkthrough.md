# Annotated ColdFusion-Oriented Walkthrough: Duplicate-Safe Narrative Saving

**Purpose:** Explain how the proposed `saveNarrativeVacancy()` handler prevents the same physical unit from being inserted twice into the Vacancy Summary when a manager submits a Narrative.

This is a **server-design walkthrough**, not drop-in code. PropertyMax’s audited client is ColdFusion-based and currently posts a form that includes `occupancy_sid` for preloaded Summary rows.[1] The actual component name, datasource, query syntax, and table/column names must be mapped to the production application before implementation.

## 1. What the handler is responsible for

The client sends a Narrative that may contain several vacancy rows. Each row can represent one of three situations:

| Situation | What the browser supplies | What the server must do |
|---|---|---|
| Existing vacancy loaded into the Narrative form | An `occupancy_sid` / `summary_sid`, often plus editable display text. | Update that exact Summary row after validating property ownership. |
| Existing physical unit typed as a new row | No Summary ID, but a unit label such as `2102 Breckenridge`. | Resolve the typed label to a canonical property-unit ID; update/link the existing current row if it exists. |
| Genuine new unit or unknown label | No Summary ID and no unambiguous unit match. | Reject for review or execute an explicitly authorized new-unit workflow. |

The handler must also withstand a double-click, timeout retry, or duplicate browser request. The duplicate-source check is therefore performed on the server and protected by a database constraint, not merely by disabling the Save button.

## 2. The top-level method

The earlier design used this conceptual structure:

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

            // Existing Summary-ID branch or blank-ID resolution branch appears here.
        }

        saveNarrativeRevision(narrative, request);
    }
}
```

The exact CFML syntax can be either tag-based or script-based. For a legacy application, a tag-style transaction is often the safest form:

```cfml
<cftransaction isolation="serializable">
    <!--- Perform all locks, Summary writes, link writes, and event writes here. --->
</cftransaction>
```

The important feature is not the syntax. The important feature is that the **link lookup, duplicate decision, Summary write, and link creation all commit or roll back together**.

> Do not save the Summary row in one transaction and create the Narrative link later. A retry during that gap can still create a duplicate.

## 3. Validate access before looking up any record

```cfml
validatePropertyAccess(sessionUser.userId, request.property_id);
```

`request.property_id` cannot be trusted merely because it was posted from a property drop-down. The server must derive the authenticated user from the ColdFusion session and check that the user may submit a Narrative for the property.

A typical helper performs a parameterized lookup against the permission assignment table:

```cfml
function validatePropertyAccess(required numeric userId, required numeric propertyId) {
    var qAccess = queryExecute(
        "SELECT 1
         FROM user_property_access
         WHERE user_id = :userId
           AND property_id = :propertyId
           AND is_active = 1",
        {
            userId = { value = arguments.userId, cfsqltype = "cf_sql_integer" },
            propertyId = { value = arguments.propertyId, cfsqltype = "cf_sql_integer" }
        },
        { datasource = application.dsn }
    );

    if (qAccess.recordCount != 1) {
        throw(type="PropertyMax.Authorization", message="PROPERTY_ACCESS_DENIED");
    }
}
```

This check prevents an altered request from submitting a Summary ID that belongs to another property. It also establishes the property context used by every later query.

## 4. Start one transaction and lock the Narrative

```cfml
<cftransaction isolation="serializable">
    narrative = lockNarrative(request.narrative_id);
    <!--- process all submitted lines --->
</cftransaction>
```

A transaction gives the save operation **atomicity**: either all accepted Narrative lines and all their Summary updates become visible, or none do. `SERIALIZABLE` is the strongest general transaction level. It prevents two concurrent saves from both observing “no existing row” and then independently inserting one.

The production SQL engine matters. On SQL Server, the implementation may use a locking hint such as `WITH (UPDLOCK, HOLDLOCK)` when selecting the current unit state. On MySQL or PostgreSQL, it may use `SELECT ... FOR UPDATE` or an equivalent constraint-based approach. The CFML layer should call a helper that encapsulates database-specific locking rather than embedding vendor assumptions everywhere.

`lockNarrative()` should confirm the Narrative exists, belongs to the property, and has a current version. It should also return its current revision/version number if optimistic concurrency is used.

```cfml
function lockNarrative(required numeric narrativeId, required numeric propertyId) {
    // Example only: use the production database’s row-lock syntax.
    var qNarrative = queryExecute(
        "SELECT narrative_id, property_id, revision
         FROM narrative
         WHERE narrative_id = :narrativeId
           AND property_id = :propertyId
         FOR UPDATE",
        {
            narrativeId = { value = arguments.narrativeId, cfsqltype = "cf_sql_integer" },
            propertyId = { value = arguments.propertyId, cfsqltype = "cf_sql_integer" }
        },
        { datasource = application.dsn }
    );

    if (qNarrative.recordCount != 1) {
        throw(type="PropertyMax.Validation", message="NARRATIVE_NOT_FOUND");
    }
    return qNarrative;
}
```

## 5. Give every line a stable identity

```cfml
lineId = ensureImmutableNarrativeLineId(narrative, line);
idempotencyKey = "N:" & narrative.id & ":L:" & lineId & ":V";
```

A Narrative can contain several vacancy lines. The system must know whether a later request is saving the **same line again** or adding a separate line. A persistent UUID such as `narrative_line_id` is the right solution.

The hidden value must be stored in the Narrative’s own line table and round-tripped through the form on every edit. It cannot be generated fresh on each request because a retry would then receive a new identity and bypass idempotency.

A good key is deterministic and domain-specific:

```text
N:8430:L:8b78e29f-8c3d-4b68-a8b7-0962355e6020:VACANCY
```

The database must enforce `UNIQUE(idempotency_key)` in the Narrative-to-Summary link table. This is the final safeguard against a second insert if the same save request reaches the server twice.

### Why a line ordinal is only a temporary fallback

A key such as `N:8430:VACANCY:2` may work for a brief migration if a Narrative’s row order never changes. It becomes unsafe when managers remove a row, add one, or reorder rows. A line UUID is more reliable because it follows the business object, not the screen position.

## 6. Check for a prior Narrative-to-Summary link first

```cfml
existingLink = lockNarrativeSummaryLink(idempotencyKey);
if (!isNull(existingLink)) {
    updateSummary(existingLink.summary_sid, line, source="NARRATIVE");
    writeSummaryEvent(existingLink.summary_sid, line, action="IDEMPOTENT_UPDATE");
    continue;
}
```

This branch is the most important duplicate control. It asks: **“Has this exact Narrative line already been linked to a Vacancy Summary row?”** If yes, the server already knows the authoritative Summary record. It must update that record or return an idempotent success; it must never try to match the text or insert a second record.

A conceptual helper looks like this:

```cfml
function lockNarrativeSummaryLink(required string idempotencyKey) {
    var qLink = queryExecute(
        "SELECT link_id, summary_sid, unit_id
         FROM narrative_summary_link
         WHERE idempotency_key = :key
         FOR UPDATE",
        {
            key = { value = arguments.idempotencyKey, cfsqltype = "cf_sql_varchar" }
        },
        { datasource = application.dsn }
    );

    return qLink.recordCount ? qLink : javacast("null", "");
}
```

The `FOR UPDATE` shown above is illustrative. The correct lock depends on the database. What matters is that the row is protected until the transaction finishes.

If the request’s values are identical to the previously saved event, the server can return `IDEMPOTENT_REPLAY` without rewriting the Summary. If a manager changed the note or rent-ready percentage on that existing Narrative line, it may update the same Summary ID and record a new history event. Either option preserves one Summary row.

## 7. The existing-Summary-ID branch

```cfml
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
```

The current Narrative form already sends a hidden `occupancy_sid` for preloaded Summary rows.[1] That is valuable: it bypasses all fuzzy unit matching.

However, `summary_sid` is only a client-supplied claim until the server verifies it. `lockSummary()` must retrieve the Summary row by primary key and confirm it belongs to the selected property. If the request contains a `unit_id`, it must also match the Summary record’s canonical unit. A mismatch is not corrected silently; it is rejected.

The visible text `line.unit_display` is editable and can be saved as a requested display-label change only if the business allows it. It must **not** determine which Summary row receives the update.

## 8. The blank-Summary-ID branch: resolve the physical unit

When `summary_sid` is blank, the server cannot safely interpret the request as “create a new vacancy.” It must first resolve the physical unit.

```cfml
unit = resolvePropertyUnit(request.property_id, line.unit_id, line.unit_display);
assert(unit.status != "NOT_FOUND", "UNIT_NOT_FOUND");
assert(unit.status != "AMBIGUOUS", "UNIT_AMBIGUOUS", unit.candidates);
```

`resolvePropertyUnit()` should apply the following strict order:

| Priority | Check | Reason |
|---|---|---|
| 1 | Valid `unit_id` posted from the unit picker. | Direct canonical identity. |
| 2 | Exact canonical label match within the selected property. | Safe if precisely one record matches. |
| 3 | Exact approved alias match for the property. | Supports known differences such as an approved `2102 Breckenridge` alias. |
| 4 | Conservative normalized lookup. | Candidate search only; resolve automatically only if one approved candidate exists. |
| 5 | None or several candidates. | Return a user-resolvable error, never a guessed insert. |

A simplified helper interface is:

```cfml
function resolvePropertyUnit(required numeric propertyId, string unitId="", string unitDisplay="") {
    if (len(trim(arguments.unitId))) {
        return findUnitByIdAndProperty(arguments.unitId, arguments.propertyId);
    }

    var candidates = findExactCanonicalOrAliasMatches(arguments.propertyId, arguments.unitDisplay);
    if (candidates.recordCount == 1) return asResolved(candidates);
    if (candidates.recordCount > 1) return asAmbiguous(candidates);

    candidates = findConservativeLookupCandidates(arguments.propertyId, makeLookupKey(arguments.unitDisplay));
    if (candidates.recordCount == 1 && candidates.approved_for_auto_match[1]) return asResolved(candidates);
    if (candidates.recordCount > 1) return asAmbiguous(candidates);

    return asNotFound();
}
```

For a blank-SID typed `2102 Breckenridge`, the server should find the approved property-unit alias or canonical lookup candidate for `2102Breckenridge` and return its `unit_id`. It should not simply compare raw strings and conclude the unit is new.

## 9. Serialize the create-or-update decision for that unit

```cfml
lockCurrentUnitState(request.property_id, unit.unit_id);
summary = findCurrentSummary(request.property_id, unit.unit_id, forUpdate=true);

if (isNull(summary)) {
    summary = createCurrentSummary(request.property_id, unit.unit_id, line, source="NARRATIVE");
    action = "CREATED_AFTER_CANONICAL_RESOLUTION";
} else {
    updateSummary(summary.summary_sid, line, source="NARRATIVE");
    action = "UPDATED_AFTER_CANONICAL_RESOLUTION";
}
```

This is where duplicate records are most commonly created if the code is careless. A naïve implementation performs:

```text
SELECT current Summary row;
IF none exists: INSERT Summary row;
```

Two simultaneous requests can both read “none exists” before either inserts. To prevent this, the server must lock a row that always exists for `(property_id, unit_id)`, or use a database uniqueness constraint that makes the second insert fail safely.

A robust pattern is a `current_unit_state` table with a unique property/unit key:

```text
current_unit_state
  property_id
  unit_id
  current_summary_sid
  updated_at

UNIQUE(property_id, unit_id)
```

`lockCurrentUnitState()` obtains the row lock before `findCurrentSummary()` runs. If no state row exists, insert it with a unique key and handle the case where another transaction wins the race. The losing transaction then reloads the winner’s row and performs an update/link instead of a second insert.

## 10. Create the source link and event inside the same transaction

```cfml
createNarrativeSummaryLink(idempotencyKey, narrative.id, lineId, summary.summary_sid);
writeSummaryEvent(summary.summary_sid, line, action=action);
```

`createNarrativeSummaryLink()` writes the unique `idempotency_key`. If this insert encounters a duplicate-key error, another request already processed the same Narrative line. The handler should roll back or savepoint-roll back its speculative work, reload the existing link, and return that link’s Summary ID as an idempotent result.

The event write records what happened, who caused it, and what was changed. A minimal event payload contains: `summary_sid`, `narrative_id`, `narrative_line_id`, `actor_user_id`, `source_type`, `action`, `before_json`, `after_json`, and `request_id`.

The event does not itself prevent duplication. It makes future auditing reliable and supports a safe data-cleanup program.

## 11. Error and duplicate-key handling

The save handler should catch only expected business and database conflicts, roll back the transaction, and return structured responses. It should not catch an error and then blindly retry an insert.

Conceptually:

```cfml
try {
    <cftransaction isolation="serializable">
        // All Narrative, Summary, link, and event work.
    </cftransaction>
}
catch (PropertyMax.Validation e) {
    return { ok=false, code=e.message, details=e.detail };
}
catch (Database.DuplicateKey e) {
    // Start a fresh read-only lookup. Do not reuse stale in-memory assumptions.
    var winningLink = findNarrativeSummaryLink(idempotencyKey);
    if (!isNull(winningLink)) {
        return { ok=true, action="IDEMPOTENT_REPLAY", summary_sid=winningLink.summary_sid };
    }
    return { ok=false, code="CONCURRENT_WRITE_CONFLICT" };
}
```

The actual ColdFusion exception type and duplicate-key code depend on the database driver. The developer should inspect the database error code, match only the expected uniqueness constraint name, and rethrow unexpected database errors. Treating all database failures as a retry is unsafe.

## 12. Save the Narrative revision last, then commit

```cfml
saveNarrativeRevision(narrative, request);
```

The Narrative record and its child line rows should be written in the same transaction as the Summary synchronization. The update should preserve each immutable `narrative_line_id`. A line that was deleted should normally be marked deleted or superseded for audit history rather than physically removed without a trace.

If the application supports autosave, each autosave should either:

1. Save a Narrative draft without touching the Vacancy Summary; or
2. Use the same idempotent line protocol described here.

It should not intermittently create Summary rows from draft form states.

## 13. Practical implementation order

| First implementation task | Why it comes first |
|---|---|
| Add `narrative_line_id` and `narrative_summary_link` with a unique idempotency key. | Stops replays and creates durable source lineage. |
| Validate and honor existing `occupancy_sid` values server-side. | Protects the already-intended prefilled update path. |
| Add `unit_id` to Summary rows and build a property-unit directory/alias table. | Gives blank-ID rows a reliable identity source. |
| Add current-unit uniqueness/locking. | Prevents race-condition inserts. |
| Replace free-text entry with a unit picker and conflict-resolution UI. | Reduces errors at the source, but is not the sole control. |

## 14. What success looks like

After deployment, the following exact sequence must be safe:

1. A manager opens Grace Townhomes and sees prefilled Summary row `1713` with `occupancy_sid = 47219`.
2. The manager updates the note and clicks Save twice because the page is slow.
3. The first request updates Summary row `47219`, inserts one Narrative-to-Summary link, and writes one event.
4. The second request finds the existing link via its idempotency key and returns `IDEMPOTENT_REPLAY` or updates the same `47219` record.
5. The Vacancy Summary contains one current `1713` row—not two.

Similarly, if a manager adds a blank-ID row typed as `2102 Breckenridge`, the server resolves it to the approved Breckenridge unit ID or blocks it for review. It must never create a second Summary row simply because the current display label is `2102Breckenridge`.

## Reference

[1]: https://propertymax.ai/app/narratives/new/ "PropertyMax.ai — Weekly Narrative / New (authenticated client-source inspection)"

---

Prepared by **Manus AI** as a detailed explanatory companion to the server-side remediation design.
