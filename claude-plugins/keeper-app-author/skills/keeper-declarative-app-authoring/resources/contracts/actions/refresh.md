# `refresh` Action

```yaml
- type: refresh
  data_sources: [tasks, selected_task]
```

Omit `data_sources` to refresh all sources in the view. Named sources must exist. Runtime refresh
expands across inferred dependencies and dependents.
