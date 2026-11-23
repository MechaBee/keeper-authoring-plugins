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

Required: `kind`, `table`. Optional: equality `filter`, one-field `sort`, positive `limit`,
`read`, `max_records`, and `refresh_on`. Filter values are primitives or standard bindings. This source is table-shaped and
may back table, list, board, collection, and record-selection UI.

Two runtime-owned tables need no schema or data file:

- `keeper_principals` is the deliberately restricted global identity projection.
- `keeper_app_members` is the safe app-scoped directory for assignee and resource-grant choices.
  It contains only active, resolved principals who can currently open the app. Prefer it whenever
  the intended choice is "a member of this app."

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
`includes` / `not_includes` (membership in a list-valued `multi_select` or multi-value reference;
a single-valued field matches its own value), `between` (two-item `value`), `in` / `not_in` (array
or a single binding), and the nullary
`is_null` / `is_not_null` (no `value`). `when_empty: ignore` drops a comparison whose bound value
is empty — so one predicate serves many optional filters — while `error` fails instead. Declare a
`bounded_scan` performance intent for large `where` scans.

## Read completeness

```yaml
read: complete      # complete | paged   (default: complete)
max_records: 20000
```

`read` decides how much of a matching result set the source returns, and it is deliberately the
author's declaration rather than the storage engine's habit — the same descriptor must mean the same
thing on JSONL and DynamoDB.

`complete` returns every policy-visible matching row, following cursor pages under one stable
revision and applying row policy before each page accumulates. It fails with a clear bound error
rather than truncating. `max_records` bounds it; both the default and the ceiling are 20,000. A
source with an explicit `limit` is already bounded and reads as a single page, so it needs neither
key.

`paged` returns one transport page plus a cursor. It is rejected as input to a `projected_table` or
`aggregate_table`, and a `record_table` column may not declare a `summary` over it — an aggregate
over one page is a wrong number. Reach for `paged` only for a direct browse of a table too large to
read completely; where a figure must cover an unbounded set, use an `aggregate_table` instead.

On a DynamoDB app, a complete read with no `where`, `filter` or `limit` walks the whole table on
every view load and is reported as a warning.

For a query that needs an explicit logical performance intent, add only the compiler-facing hint:

```yaml
performance:
  intent: indexed # `auto` and `bounded_scan` are also supported
  maxFallbackRecords: 250 # optional positive bound
```

Use this only after reading the live contract and [Storage](../../storage/index.md)
when the app uses DynamoDB. It never declares an index, key, or physical capacity setting.
