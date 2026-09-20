# `set_state` Action

```yaml
- type: set_state
  key: selectedTaskId
  value:
    bind: record.id
```

`key` is a safe view-state key. `value` is a primitive or action-bound value. Use it for local
selection/filter changes; use `route_state` when the value must be deep-linkable.
