# `table` Data Source

Use a mutable workspace table for ordinary browse and edit surfaces:

```yaml
tasks:
  kind: table
  table: tasks
  filter:
    status:
      bind: state.statusFilter
  sort:
    field: due_date
    direction: asc
  limit: 100
  refresh_on: [state.statusFilter]
```

Required: `kind`, `table`. Optional: equality `filter`, one-field `sort`, positive `limit`, and
`refresh_on`. Filter values are primitives or standard bindings. This source is table-shaped and
may back table, list, board, collection, and record-selection UI.

For range or multi-condition queries, add a typed `where` predicate instead of, or alongside,
equality `filter`:

```yaml
where:
  all:
    - {field: work_date, op: gte, value: {bind: state.from_date}, when_empty: ignore}
    - {field: work_date, op: lte, value: {bind: state.to_date}, when_empty: ignore}
    - {field: project_id, op: equals, value: {bind: state.project_id}, when_empty: ignore}
```

A `where` node is exactly one of a logical group (`all` / `any` / `not`) or a comparison
`{field, op, value, when_empty}`. Operators are `equals`, `not_equals`, `lt`, `lte`, `gt`, `gte`,
`between` (two-item `value`), `in` / `not_in` (array or a single binding), and the nullary
`is_null` / `is_not_null` (no `value`). `when_empty: ignore` drops a comparison whose bound value
is empty — so one predicate serves many optional filters — while `error` fails instead. Declare a
`bounded_scan` performance intent for large `where` scans.

For a query that needs an explicit logical performance intent, add only the compiler-facing hint:

```yaml
performance:
  intent: indexed # `auto` and `bounded_scan` are also supported
  maxFallbackRecords: 250 # optional positive bound
```

Use this only after reading the live contract and [DynamoDB authoring](../../dynamodb-authoring.md)
when the app uses DynamoDB. It never declares an index, key, or physical capacity setting.
