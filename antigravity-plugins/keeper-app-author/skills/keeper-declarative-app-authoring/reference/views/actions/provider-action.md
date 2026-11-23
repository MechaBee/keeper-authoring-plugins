# `provider_action` Action

```yaml
- type: provider_action
  provider: workspace
  action: delete_record
  params:
    table: tasks
    recordId:
      bind: record.id
    mode: block
  on_success:
    - type: refresh
      data_sources: [tasks]
```

Required: documented `provider` and `action`. Optional flat primitive/bound `params`, `on_success`,
and `on_error`. Follow-ups may bind `action.result.*`; record-triggered actions also retain
`record.*`. Prefer provider-generated action sets for complex inputs, previews, confirmations, and
permission-aware disabled states.
