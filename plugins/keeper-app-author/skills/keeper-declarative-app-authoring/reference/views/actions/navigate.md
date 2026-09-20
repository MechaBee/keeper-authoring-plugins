# `navigate` Action

```yaml
- type: navigate
  viewId: task-detail
  query:
    taskId:
      bind: record.id
```

`viewId` must name an existing view. Optional `query` values are primitives or action-bound values.
Navigation replaces route parameters; include every destination context key explicitly. The
destination must consume the query through `route_state` or `route.*`.
