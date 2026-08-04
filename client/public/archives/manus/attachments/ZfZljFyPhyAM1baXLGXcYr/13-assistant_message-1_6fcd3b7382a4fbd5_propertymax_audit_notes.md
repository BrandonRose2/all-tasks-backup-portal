# PropertyMax.ai Narrative Duplication Audit Notes

## Scope and incident evidence

The supplied emails identify recurring duplicate vacancy records at **Grace Townhomes, Lexington, Breckenridge, and Walnut Hill**. The reported duplicates appeared on the same dates as manager narrative submissions. Ethan stated that most affected unit labels appeared to be exact duplicates, although the unit-label comparison was not completed exhaustively. The concern is that a narrative-derived vacancy section may be adding records already present in the Summary/Vacancy Report.

## Authenticated application observation — 2026-07-17

The user authenticated to `https://propertymax.ai/app/`. The current page is **Narratives → Weekly Report**, covering **2026-06-17 through 2026-07-17**. The table shows narrative submissions for the affected properties on 2026-07-17, including Grace Townhomes (five over-vacancy-past, three over-vacancy-next, six leases), Lexington (zero, three, zero leases), Breckenridge (three, three, two leases), and a later visible row for Walnut Hill on 2026-07-16. The current page provides per-submission **View** controls, which will be used in read-only inspection.

## Audit safety boundary

No data has been modified, deleted, submitted, or disabled. The audit will compare normalized and raw unit labels, record source, date, and status before proposing changes.

## Initial hypothesis

A strict raw-string equality test between narrative text and report data would fail for formatting variants such as `217E`, `217 E`, `Unit 217E`, and `217 Eventide St.`. However, email evidence suggests some duplicates may be exact matches, so a second defect—failure to enforce a source-aware idempotency or unique-record constraint—must also be tested.


## Unit-level evidence — Grace Townhomes narrative ID 8430

The July 17, 2026 narrative submitted by S. Lopez for **Grace Townhomes** contains seven vacancies with raw unit labels: `1713`, `1812`, `2312`, `122`, `514`, `1214`, and `2112`. Its seven associated notes identify statuses such as not leased, skip, preleased, and renovation work. The narrative’s structured summary separately states six vacant units and one pending application. This demonstrates that the narrative stores a unit list in its own distinct record and that the units are presented as bare numbers rather than canonical property-unit identifiers or immutable unit IDs.

The narrative reported six leases as a comma-separated free-text string: `914,712,812,1511,1513 & 123`. This confirms that even non-vacancy unit references are captured as human-entered text, with punctuation and delimiter variation.

## Application implementation evidence

The Vacancy Summary client sends `GET /vacancy.cfc?method=saveprop` with `statusid`, `buildingid`, and raw `unit` text, alongside status-specific fields. The observed client code validates only required fields; it does not compare the input with existing vacancy records, does not normalize the unit string, and does not pass a narrative ID, source type, or idempotency token. The same page refreshes its presentation with `GET /vacancy.cfc?method=getsummary&regionid=…`.

This does not prove the server method lacks a uniqueness check, but it proves the user interface does not protect against duplicate creation and that the create interface is not designed to preserve source lineage. Server-side protection is therefore essential.


## Additional narrative-format evidence

**Lexington, narrative ID 8429 (week of July 13, submitted July 17):** The structured `Vacancies` count is zero, but the free-text summary says the property is fully occupied while listing two notices-to-vacate: `1532 D -preleased` and `1521 V not leased`. Its structured move-in rows use two different but equivalent-looking forms: `1523V` and `1526 V`; its unit-turn-completed row uses `1526V`. This is direct evidence that a single narrative can represent the same stylistic unit pattern with inconsistent whitespace and suffix treatment.

**Breckenridge, narrative ID 8428 (week of July 13, submitted July 17):** The structured vacancy is entered as `2102 Breckenridge` with note `this was a skip`, while the unit-turn-outstanding record is entered as `2102 B` with a painting status. The leases field also mentions `2102 Lafayette`. These labels can plausibly refer to one physical unit or distinct units depending on the property’s unit directory, but cannot be safely resolved from raw strings alone. Any routine that treats exact display text as an identity will fail to match these variants.

The browser navigation sequence showed that narrative IDs are independent from vacancy-report entries; no cross-source ID is surfaced in the narrative view.


## Walnut Hill evidence and Region 2 report aggregation

**Walnut Hill, narrative ID 8420 (week of July 13, submitted July 16):** Structured vacancies use `304-B`, `202-A`, and `302-J`; the unit-turn-outstanding list repeats `202-A`. The narrative also uses `101-F` identically for both a lease signed and a move-in. This shows that an overlap can be intentional within a narrative and therefore cannot be treated as a duplicate without the status/event context.

The detailed Vacancy Report assigns all four affected properties to **Region 2**. Its read-only `getvacancies` response for July 17, 2026 reports aggregate status counts in the visual order Vacant, Preleased, Notice, Rented, Eviction: Grace Townhomes `15, 0, 37, 2, 0`; Lexington `2, 1, 13, 1, 0`; Breckenridge `3, 0, 5, 0, 1`; Walnut Hill `6, 4, 0, 8, 0`. These counts substantially exceed the unit lists in the specific latest narratives, confirming that the Vacancy Report contains a longer-lived operational record set, not just the current weekly narrative data.

The chart endpoint is `GET /functions.cfc?method=getvacancies&regionid=2&dt=2026-07-17`. It returns aggregate data only; it cannot establish exact row-to-row equivalence between narrative records and vacancy-report records.


## Direct unit-level comparison from Vacancy Summary API

A read-only call to `GET https://propertymax.ai/vacancy.cfc?method=getsummary&regionid=2` returned the Region 2 individual-record report. It provides the first direct link between narrative-style labels and Vacancy Report rows.

| Property | Narrative label | Vacancy Summary label | Evidence | Interpretation |
|---|---|---|---|---|
| Breckenridge | `2102 Breckenridge` | `2102Breckenridge` | A pre-existing Vacancy Summary row dated 2026-06-29 (by Susan) shows notes dated 2026-07-13, including `07/13/226 (SKIP) Not Leased`; the narrative was submitted in the same weekly window. | Whitespace is removed in the report’s persisted display. Raw-string equality would fail, even though the numeric/base label is the same. |
| Grace Townhomes | `1713` | `1713` | Summary row created 2026-01-13; it includes a 2026-07-13 note by Susan, `07/13/2026 not leased`. | This is an exact unit-number match, but the report row long predates the narrative. A creation-time duplicate test alone is insufficient; the integration must update/link the existing row rather than insert. |
| Grace Townhomes | `2312` | `2312` | Summary row created 2026-02-26; it contains a 2026-07-13 note `07-13-2026 NOT LEASED`. | Exact match with a pre-existing record and same reporting-window update. |
| Grace Townhomes | `122` | `122` | Summary row created 2026-03-26; it includes a 2026-07-13 note `07/13/2026 NOT LEased`. | Exact match with a pre-existing record and same reporting-window update. |
| Grace Townhomes | `1812` | `1812` | Summary row created 2026-05-15; it is present in the direct summary response. | Another raw-unit match to a long-lived report row. |

This evidence confirms two distinct failure modes: **formatting variation** (`2102 Breckenridge` versus `2102Breckenridge`) and **missing or unreliable idempotent linkage** for records that already exist. The report response also exposes date and author information but does not expose narrative IDs or a source-record key, so it cannot prove whether each note was created through the narrative automation or by a separate user action.


## Narrative form design evidence

The `Weekly Narrative / New` form was inspected without entering or submitting any data. It requires users to select a property, then presents `Vacant Units` as a **numeric count** field. There is no visible unit-directory selector, canonical unit ID, existing-vacancy search, or match-preview on the form. In submitted narratives, the individual unit rows are therefore a separate free-text-entry mechanism driven by the count, and managers can enter any display string such as `2102 Breckenridge`, `2102 B`, `1526 V`, or `1526V`.

This confirms the root UI constraint: the narrative workflow collects user-authored identifiers without enforcing a property-specific unit master. A downstream integration cannot reliably depend on literal string equality.


## Source-level linkage findings — critical correction

The narrative form is more integrated than the surface UI alone suggests. When a property is selected, it issues `POST /functions.cfc` with `method=GetSummaryDetails` and the selected `property_id`. For each returned vacancy item (`statusid == 1`), it renders a visible text input named `occupancy_unit` **and** a hidden `occupancy_sid` populated from `item.sid`. It also preloads the existing status, move-out date, beds, rent ask, readiness, and note. The form sets the visible vacant-unit count from the number of returned items.

This means that the intended update path is **ID-based**, not literal-string-based: pre-existing Vacancy Summary rows should retain their `sid` and be updated through the narrative form. However, the visible Unit Number remains editable free text, and rows added after the current Summary count are created with blank `occupancy_sid` values. The client does not query/validate the unit directory before submitting a blank-SID row, does not normalize the label, and does not warn when the typed unit looks like an existing record. Therefore, any user who adds an additional row for an existing unit (especially with a formatting variant) can trigger an insert path unless the server rejects it.

The form preserves `sid` while temporarily reducing the count to zero and restoring it, so that interaction alone should not cause an unintended new record. The vulnerable action is adding a **new blank-SID row** or using an alternate path that omits `sid`.

Important references in captured page source: form POST action `/app/narratives/new/` at line 954; `GetSummaryDetails` call at lines 1387–1392; existing vacancy SID/Unit fields at lines 1439–1498; blank-SID row generation at lines 1625–1685.

