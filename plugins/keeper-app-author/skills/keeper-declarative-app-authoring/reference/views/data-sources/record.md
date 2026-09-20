# `record` Data Source

Use one workspace row for detail or markdown surfaces:

```yaml
selected_task:
  kind: record
  table: tasks
  id:
    bind: state.selectedTaskId
  refresh_on: [state.selectedTaskId]
```

Required: `kind`, `table`, and primitive/bound `id`. Optional: `refresh_on`. Empty or null id
resolves to `record: null`; components must provide a useful empty state. This is the normal source
for editable `record_detail`.
