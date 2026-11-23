# `aggregate_table` Data Source

Use `aggregate_table` for grouped counts and numeric summaries computed from a complete
table-shaped source. It is read-only and resolves to rows matching a declared output schema.

```yaml
data_sources:
  entries:
    kind: table
    table: time_entries
    read: complete

  totals_by_project:
    kind: aggregate_table
    schema: project_totals
    from: {source: entries}
    group_by:
      - {field: project_id}
    metrics:
      - {operation: count, as: entry_count}
      - {operation: sum, field: duration_minutes, as: total_minutes}
    sort: {field: total_minutes, direction: desc}
    limit: 20
    refresh_on: [state.from_date, state.to_date]
```

Required keys are:

- `schema`: an application schema describing every output field;
- `from.source`: a known complete table-shaped source;
- non-empty `metrics`.

Optional keys are `group_by`, `sort`, positive `limit`, and `refresh_on`. Each group entry requires
an input `field` and may set `as`; without `as`, the output field keeps the input field id. Omitting
`group_by` produces one row for the complete input set.

Metrics require a unique output `as`. Supported operations are `count`, `sum`, `average`,
`minimum`, and `maximum`. `count` may omit `field` to count rows; when it names a field it counts
non-empty values. All other operations require a numeric input field. Empty numeric sets produce
`null`, except `sum`, which produces `0`.

The union of group output fields and metric `as` fields must exactly populate the output schema:
no undeclared output and no schema field left unfilled. The output schema is an ordinary schema
file but should not have JSONL data; it describes the derived rows only.

The input cannot be a `table` source with `read: paged`, because aggregating one transport page
would produce a misleading result. Use a bounded or `read: complete` source; complete reads fail at
their declared bound rather than silently truncating. `aggregate_table` may consume direct,
projected, or aggregate table-shaped sources and may back read-only table/list/stats components.
