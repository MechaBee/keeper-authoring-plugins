# Aggregate Constraints Reference

Use a logical `aggregate_bound` when a sum must remain within a bound for every group. Keeper owns
the physical enforcement for each storage engine; never emulate this with a write-time
`validationPolicy.check` that queries sibling rows.

```yaml
constraints:
  - id: daily-hours-at-most-24
    kind: aggregate_bound
    groupBy: [owner_user_id, work_date]
    aggregate:
      operation: sum
      field: hours
    maximum: 24
    message: Daily time cannot exceed 24 hours.
```

`id`, non-empty `groupBy`, `aggregate.operation: sum`, finite non-negative `maximum`, and `message`
are required. The aggregate field must be a required number with a finite non-negative field-level
`min`; this makes writes and backfill monotonic. `minimum` is intentionally unsupported because a
lower-bound sum needs distinct group creation/deletion semantics. Group fields must be scalar and key-encodable.
Changing a constraint is a data migration: Keeper backfills and verifies its guard before a
DynamoDB definition becomes active, while JSONL evaluates the complete candidate table under its
optimistic write revision.
