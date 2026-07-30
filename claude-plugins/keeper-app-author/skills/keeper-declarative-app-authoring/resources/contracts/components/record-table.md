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
`empty_message`, and `on_row_click`. Every referenced field must exist in the resolved schema.
