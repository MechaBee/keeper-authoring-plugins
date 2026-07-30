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
`badge_field`, `meta_fields`, `empty_message`, and `on_row_click`. Meta entries use the same field
or column-object shape as `record_table`. Every referenced field must exist.
