# Validation Policy Reference

`validationPolicy` adds write-time integrity beyond field types. It must define `unique`, `checks`,
or both.

```yaml
validationPolicy:
  unique:
    - fields: [owner_user_id, week_start]     # composite uniqueness
      message: This member already has a timesheet for that week.
  checks:
    - id: quarter_hour_duration
      operations: [create, update]            # optional; defaults to both
      message: Duration must be a positive multiple of 15 minutes.
      input:
        candidate: {kind: candidate}          # the row being written
      code: |
        const c = input.candidate;
        return Number.isInteger(c.duration_minutes)
          && c.duration_minutes >= 15
          && c.duration_minutes % 15 === 0;
```

- `unique` — each entry is `{fields, message}`; `fields` is a non-empty list of schema field ids
  enforced as one composite uniqueness constraint.
- `checks` — each is a named predicate with a unique `id`, optional `operations`
  (`create` / `update`), a `message` shown on failure, a non-empty JavaScript `code` string, and a
  non-empty `input` map. The script returns truthy to pass and receives only its declared `input`.
- Validation-check `input` kinds:
  - `{kind: candidate}` — the row as it will be written.
  - `{kind: current}` — the existing stored row (update only).
  - `{kind: related_record, relationField: <field>}` — the record referenced through a declared
    relation, so a check can compare against it (for example a task's `project_id`).
  - `{kind: query_records, table: <table>, filter: {...}}` — rows from another table; each filter
    value binds a `candidate.*`, `current.*`, or `system.actorUserId|actorEmail|appRole` value.

Prefer field types, `unique`, `relations`, and `constraints` for structural rules; reserve `checks`
for cross-field logic. Never emulate a cross-record aggregate with a check that scans sibling rows —
use a `constraints` `aggregate_bound` instead.

`query_records` validation-check inputs are a JSONL compatibility feature; DynamoDB rejects them for writes. Use supported logical constraints for cross-record invariants.
