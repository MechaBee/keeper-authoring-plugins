# `record_table` Component

Use for dense, repeat-use browsing of a table-shaped source.

```yaml
kind: record_table
title: Tasks
data_source: tasks
columns:
  - field: title
  - field: status
    label: Stage
    align: center
    empty_text: Unset
search:
  enabled: true
  placeholder: Search tasks
  fields: [title, description]
sort:
  enabled: true
  default: {field: due_date, direction: asc}
density: compact
selection:
  state_key: selectedTaskId
  reconcile: first_available
  reset_state: [selectedSubtaskId]
on_row_click:
  - type: set_state
    key: selectedTaskId
    value: {bind: record.id}
```

Required: `data_source` and non-empty `columns`. Column entries are a field id or an object with
`field`, optional `label`, `align: left|center|right`, `empty_text`, and `wrap`. Optional component
keys are `title`, `description`, `search`, `sort`, `density: comfortable|compact`, `selection`,
`empty_message`, `on_row_click`, and `export`. Every referenced field must exist in the resolved
schema.

`export` adds a CSV download:

```yaml
export:
  enabled: true
  label: Export CSV
  filename: entries.csv
  fields: [work_date, project_id, duration_minutes]  # columns to include
  scope: complete        # `page` exports the loaded page; `complete` streams every
                         # policy-visible row up to `max_records`
  max_records: 10000
```

Pair `scope: complete` with a `bounded_scan` source `performance` intent for large tables.
