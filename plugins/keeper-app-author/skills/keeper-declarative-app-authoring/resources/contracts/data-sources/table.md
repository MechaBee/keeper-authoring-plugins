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
