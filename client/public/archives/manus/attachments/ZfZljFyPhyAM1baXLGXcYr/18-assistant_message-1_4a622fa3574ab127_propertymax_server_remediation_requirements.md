# PropertyMax Server-Side Remediation Requirements

## Identity invariant

A physical unit must be identified by a stable, property-scoped `unit_id`; a human-readable unit label is presentation data and must not be used as the sole database key. A Vacancy Summary row must either reference a valid `unit_id` or be explicitly marked as a reviewed exception.

## Update invariant

When a narrative line includes an existing Summary record identifier (`summary_sid` / current `occupancy_sid`), the server must update only that record after verifying that it belongs to the selected property. Client-provided unit text must not redirect the update to another record.

## Insert invariant

A narrative line without a Summary record identifier must never be inserted solely because its display string does not exactly match an existing string. The server must resolve it to a canonical property unit, require the user to select among ambiguous candidates, or use an authorized exception workflow.

## Idempotency invariant

The same narrative line may be saved, retried, refreshed, or replayed without creating a second Summary record or a second link. The server must persist a unique, deterministic idempotency key and enforce it with a database constraint inside the same transaction as the Summary write.

## Lineage invariant

Every Summary update or insert derived from a narrative must be traceable to `narrative_id`, `narrative_line_id`, user ID, action timestamp, and source type. Any manual Vacancy Report write must have distinct source lineage.

## Concurrency invariant

Two users or processes saving the same property/unit at the same time must not create duplicate Summary rows. The database transaction must lock or serialize the relevant unit/link row and translate uniqueness conflicts into an idempotent success or a user-resolvable conflict.

## Audit and rollback invariant

The remediation must retain historical values and links. Merging legacy duplicates must be a reviewable, reversible process that preserves notes, source events, and record history rather than deleting rows blindly.

## Required acceptance conditions

The deployed system must demonstrate that: an existing prefilled unit updates its existing Summary row; an alternate rendering of an existing unit does not create a second row; a duplicate POST has no additional effect; ambiguous labels require a human decision; and any truly new unit is explicitly authorized and audited.
