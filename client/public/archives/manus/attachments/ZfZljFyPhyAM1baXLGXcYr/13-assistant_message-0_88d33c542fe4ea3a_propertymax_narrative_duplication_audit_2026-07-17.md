# PropertyMax.ai Narrative-to-Vacancy Duplication Audit

**Audit date:** July 17, 2026  
**Scope:** Read-only review of affected weekly narratives, the Region 2 Vacancy Summary, and the Narrative entry workflow.  
**Data changes:** **None.** No records were created, edited, deleted, merged, or disabled.

## Executive conclusion

The issue is **not fully fixed**. PropertyMax has a partially implemented, ID-based update path: when a manager opens a new narrative for a property, the application retrieves existing Vacancy Summary rows and carries their hidden `sid` values into the narrative form. In the normal prefilled workflow, that allows the application to update an existing row rather than create another one.[1]

However, that safeguard is incomplete. The unit-number field remains editable text, and any extra narrative row generated beyond the preloaded count receives a blank `sid`. The current client does not validate that a blank-SID unit already exists, normalize its label, or warn the user before submission.[1] If the server accepts that row as new, a second Vacancy Summary record can be created for the same physical unit.

> **The right fix is not to require exact display-text matches.** The system must match and persist a stable property-specific unit ID, with server-side duplicate protection and narrative-line idempotency.

## Direct answer to Bob’s question

The unit labels are **not consistently written the same way** in both places. The audit found `2102 Breckenridge` in the narrative and `2102Breckenridge` in the Vacancy Summary. In the Lexington narrative, the same unit pattern was expressed as both `1526 V` and `1526V`. Thus, a literal text comparison will fail even when the manager is referring to the same physical unit.[2]

There is also evidence that the intended update path is working for some rows. In Grace Townhomes, the Vacancy Summary rows for `1713`, `2312`, `122`, and `1812` predated the July 17 narrative and carried updates in the same reporting window. That indicates existing records can be updated rather than recreated when their Summary IDs are preserved.[3]

The evidence does **not** establish that every sampled narrative produced a second live Summary row. The current report endpoint does not expose a narrative ID or source-line link, so a complete row-for-row historical attribution is not possible from the available read-only views. It does establish that the current design still has a repeatable duplicate-creation path and cannot safely rely on exact unit text.

## Verified evidence

| Finding | Evidence | Operational meaning |
|---|---|---|
| Narrative unit labels vary in formatting. | `2102 Breckenridge` in a Breckenridge narrative appears as `2102Breckenridge` in the Summary; Lexington uses both `1526 V` and `1526V` in one narrative. | Raw-text equality is not a reliable identity rule. |
| Existing vacancy records can be retained in a narrative. | Selecting a property calls `GetSummaryDetails`; returned vacancy rows are rendered with an `occupancy_sid` hidden field and the existing unit data. | The intended workflow is ID-based update, not text matching. |
| Newly added narrative lines lack an ID. | When the manager increases the vacancy count beyond the preloaded rows, each new row is rendered with a blank `occupancy_sid`. | The save handler must resolve or reject blank-ID rows server-side. |
| There is no client-side duplicate guard. | The editable Unit Number field is free text; the client does not perform canonical lookup, unit-master validation, or duplicate warning. | The interface allows a manager to add an alternate spelling of an existing unit. |
| Some current-report rows are long-lived, not narrative-created. | Grace Townhomes rows such as `1713`, `2312`, and `122` were created months before the July narrative but received July 13 notes. | Duplicate analysis must distinguish an update to an old vacancy from creation of a second vacancy record. |

## Root cause

The application currently mixes two identity models. The preloaded narrative rows use the Summary record’s stable `sid`, which is correct. But newly entered vacancy rows are identified only by editable raw text such as `2102 Breckenridge` or `2102Breckenridge`. If a user adds a row instead of reusing the prefilled one, the submission has no authoritative unit identity. The back end must then either match the text or insert a row; literal-text comparison fails on whitespace, hyphens, building suffixes, abbreviations, and other human-entry differences.

The problem is therefore **not primarily manager error**. The interface makes it easy to create an ambiguous blank-ID entry, and the application does not require the back end to make the operation idempotent. Exact duplicate labels can still result in duplication if the write path ignores an existing `sid`, a prior narrative link, or a duplicate submission. Conversely, different labels may legitimately refer to different units, so aggressive string stripping is unsafe.

## Recommended remediation

| Priority | Change | Why it resolves the issue | Acceptance criterion |
|---|---|---|---|
| P0 | Preserve and honor `occupancy_sid` whenever it is present. Update only that Summary record after confirming the selected property owns it. | Makes the existing intended path deterministic and prevents unit-label edits from changing the record identity. | Saving a prefilled `1713` row updates its existing Summary ID and never inserts a second `1713`. |
| P0 | For every blank-SID narrative row, perform a **server-side** lookup against a property-specific unit master before insert. | Prevents an alternate display string from bypassing the existing record. | Entering `2102 Breckenridge` when the canonical unit is `2102Breckenridge` links/updates the existing record or requires an explicit exception. |
| P0 | Add a database-level idempotency key for each narrative vacancy line, for example `N:{narrative_id}:O:{line_sequence}`. Enforce uniqueness in the same transaction as the Summary update. | Stops duplicate writes caused by a double-click, retry, browser refresh, or background replay. | Resubmitting the same narrative line creates zero additional Summary records. |
| P1 | Replace the free-text Unit Number field with a searchable property-unit picker that submits `unit_id`; display the canonical label separately. | Removes ambiguity at the source while preserving a familiar label for managers. | Managers cannot submit a narrative vacancy without a valid `unit_id` or an authorized “new unit” exception. |
| P1 | Lock the unit identity for prefilled rows. If a manager needs to change it, require “replace linked unit” and run a duplicate check before saving. | Prevents an existing `sid` from being silently paired with unrelated typed text. | Editing a prefilled unit shows a confirmation and preserves the audit trail. |
| P1 | Add a match-preview panel for blank rows: “Matches existing Summary record: 2102Breckenridge — use it?” | Gives managers a clear, low-friction correction before submit. | A likely existing unit is surfaced before any new Summary row is created. |
| P2 | Store source lineage on the Summary record or an association table: `narrative_id`, `narrative_line_id`, `source_type`, `created_by`, and timestamps. | Makes future audits decisive and lets reports distinguish manual updates from narrative synchronization. | An auditor can trace every Summary change to one narrative line or manual entry. |

## Safe matching design

A property must have a canonical unit master. The server should submit and store `unit_id` as the identity, while retaining `unit_display` only as presentation text. A legacy normalization function can help find candidates, but it should never be the final authority where suffixes or punctuation could distinguish real units.

```text
On narrative save, for each vacancy line:

1. If summary_sid is present:
     verify summary_sid belongs to the selected property
     update that exact Summary record

2. If summary_sid is absent:
     resolve unit_id from the selected property’s unit master
     if one approved match exists:
         update/link that Summary record
     if no approved match exists:
         create a new Summary record only after explicit “new unit” authorization
     if multiple candidates exist:
         block save and require manager selection

3. In the same database transaction:
     upsert the narrative-line-to-summary link
     enforce a unique idempotency key for the narrative line
```

A safe legacy normalizer may trim outer whitespace, uppercase letters, collapse internal spaces, and remove the word `UNIT` only for candidate search. It should not automatically erase hyphens, building letters, street names, or suffixes unless the property’s unit master declares them aliases. For example, `202-A` and `202A` should be reviewed against the unit master rather than automatically merged.

## Immediate operational containment

Until the application change is deployed, managers should select their property in the Narrative form and use the vacancy rows that are automatically prefilled from the Vacancy Summary. They should **not** add a new vacancy row for a unit that already appears in the prefilled list, even if the visible label looks slightly different. If a unit appears missing or uses a different naming convention, the manager should flag it for review rather than creating an alternate spelling.

Management should also instruct staff not to enter the same vacancy independently through both the Vacancy Report and the Narrative workflow during the same reporting cycle. This is a temporary operational control, not a substitute for the technical fix.

## Data-repair plan

Before changing existing records, export and back up the current Vacancy Summary. Then generate a candidate-review queue rather than automatically deleting rows. The queue should compare records within the same property using: canonical `unit_id` where available; otherwise a conservative normalized label; overlapping vacancy status; overlapping effective dates; and shared note or narrative timing.

| Repair step | Safe action | Do not do |
|---|---|---|
| Identify candidates | Flag same-property rows whose normalized labels map to the same approved unit. | Treat every similar-looking label as the same unit. |
| Review history | Compare status, move-out date, notes, creator, and source lineage. | Delete the older record merely because it has a similar label. |
| Merge | Choose one canonical Summary record, preserve all notes/history, and redirect narrative links. | Overwrite notes or erase the audit trail. |
| Prevent recurrence | Deploy the server-side ID and idempotency controls before bulk cleanup. | Clean data first while leaving the vulnerable write path live. |

## Regression test matrix

| Test | Expected result |
|---|---|
| Existing `1713` is preloaded with a valid `sid`; manager saves narrative. | The existing row is updated; no new `1713` record is inserted. |
| Existing `2102Breckenridge`; manager enters `2102 Breckenridge` as a blank-ID row. | The app resolves the canonical unit and links/updates it, or blocks for selection; it does not silently insert. |
| Same narrative save is submitted twice or retried after a timeout. | The idempotency key prevents a second Summary row. |
| `202-A` and `202A` are potential matches. | The app uses the property unit master/alias list or asks the manager; it does not auto-merge solely on punctuation. |
| A genuinely new valid unit has no matching unit master record. | Creation requires authorized exception handling and produces source lineage. |
| Manager changes the vacancy count down to zero and restores it. | The existing `sid` values are retained and no records are converted into blank-ID inserts. |

## Recommended response to Bob Bell

> Bob, I audited the current Narrative and Vacancy Summary workflow. The answer is that the unit strings are not reliably identical: for example, I found `2102 Breckenridge` in a narrative versus `2102Breckenridge` in the Summary, and other entries vary in spacing and suffix formatting. More importantly, the narrative form is intended to carry the existing Summary record ID, but a manager can add a new blank-ID row and the current screen does not validate whether that typed unit already exists. So the fix needs to be ID-based and enforced on the server, not dependent on exact text matching. I have a remediation plan that preserves existing Summary IDs, resolves blank rows against a property-specific unit directory, and blocks duplicate submissions with a narrative-line idempotency key.

## References

[1]: https://propertymax.ai/app/narratives/new/ "PropertyMax.ai — Weekly Narrative / New (authenticated source inspection)"
[2]: https://propertymax.ai/app/narratives/view/?id=8428 "PropertyMax.ai — Breckenridge Narrative 8428 (authenticated)"
[3]: https://propertymax.ai/vacancy.cfc?method=getsummary&regionid=2 "PropertyMax.ai — Region 2 Vacancy Summary (authenticated)"
[4]: https://propertymax.ai/app/narratives/view/?id=8429 "PropertyMax.ai — Lexington Narrative 8429 (authenticated)"
[5]: https://propertymax.ai/app/narratives/view/?id=8430 "PropertyMax.ai — Grace Townhomes Narrative 8430 (authenticated)"

---

Prepared by **Manus AI** from authenticated, read-only application inspection.
