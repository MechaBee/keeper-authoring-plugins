# `record_list` Component

Use for compact card/list browsing of a table-shaped source.

```yaml
kind: record_list
data_source: tasks
title_field: title
body_field: description
badge_field: status
meta_fields: [due_date, owner_id]
empty_message: No tasks yet.
on_row_click:
  - type: navigate
    viewId: task-detail
    query:
      taskId: {bind: record.id}
```

Required: `data_source` and `title_field`. Optional: `title`, `description`, `body_field`,
`badge_field`, `meta_fields`, `density`, `hide_when_empty`, `empty_message`, and `on_row_click`.
Meta entries use the same field or column-object shape as `record_table`; `label: ""` shows the
value without a visible label. Every referenced field must exist.

`density: compact` renders dense one-line rows for side panels. `hide_when_empty: true` renders
nothing when there are no rows; a surrounding `stack` then leaves no empty gap. Use it for optional
sections such as related or sub-record lists.
