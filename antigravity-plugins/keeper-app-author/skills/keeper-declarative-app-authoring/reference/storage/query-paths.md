# Logical Query Paths Reference

Declare stable logical query capabilities on the schema when a query must avoid bounded canonical
fallback. These declarations are storage-engine neutral; never author physical keys, shards,
generations, scope variants, or Access records. A path is `{id, equalityFields, orderFields}` and
takes one of three shapes:

```yaml
queryPaths:
  - id: by_updated                 # pure ordering — equalityFields may be empty
    equalityFields: []
    orderFields: [updated_at]
  - id: exact_period_key           # equality only — orderFields may be omitted
    equalityFields: [period_key]
  - id: by_owner_cell_start        # composite equality plus ordering
    equalityFields: [timesheet_id, work_date, project_id]
    orderFields: [started_at]
```

Design each path from the query it must serve: a query binds a declared path when its equality
filters match `equalityFields` and its `sort` field matches `orderFields`. So `equalityFields` are
the query's equality filters (plain `filter` values and `where … op: equals` comparisons) and
`orderFields` is its sort field. Omit any field that `rowAccess` already owns — for example an
`owner` policy's owner field — because Keeper compiles the authorization variants for you; that is
why owner-scoped tables list only their non-owner filters.

Rules the runtime enforces: every field must exist and be scalar/key-encodable; a path declares at
least one equality or order field; a field may not appear in both lists; and `orderFields` must
omit the primary key — Keeper appends it automatically. A view, workflow, or agent may use a
compatible declared path, but changing those consumers alone does not redeploy DynamoDB storage.
Queries without a compatible path use their bounded fallback policy; `performance.intent: indexed`
instead produces a validation/runtime error with a suggested `queryPaths` entry.
