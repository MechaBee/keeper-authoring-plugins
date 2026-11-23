# `record_form` Component

Use for standalone record creation:

```yaml
kind: record_form
table: tasks
fields: [title, status, due_date]
defaults:
  project_id: {bind: route.projectId}
submit_label: Create task
required_state_keys: [projectId]
on_success:
  - type: navigate
    viewId: task-detail
    query:
      taskId: {bind: record.id}
```

Required: `table`. Optional: `title`, `description`, `fields`, `defaults`, `empty_message`,
`submit_label`, `required_state_keys`, and action-array `on_success`. Omitted fields means all
non-primary-key schema fields. Field entries are ids or `{field, mode: edit|display,
contentFormat}`. Defaults may bind `state`, `route`, `source`, or `context`.

The view still requires a non-empty `data_sources` map. `on_success` receives the created row as
reserved `record.*`; never use an entity-named binding root. Omit primary-key, readonly, and
computed fields from writable forms.

A `compute` block adds reactive/initialization field values — e.g. default a field to today's date
on load, or derive one field from others as the user types. See
[bindings/compute.md](../bindings/compute.md).
