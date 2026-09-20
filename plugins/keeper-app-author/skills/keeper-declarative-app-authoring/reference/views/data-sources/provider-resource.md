# `provider_resource` Data Source

Use only a documented provider and resource:

```yaml
binding_agents:
  kind: provider_resource
  provider: orchestrator
  resource: binding_agents
  params:
    team_path:
      bind: source.selected_binding.record.team_path
  depends_on: [selected_binding]
  refresh_on: [route.bindingId]
  poll:
    everySeconds: 10
```

Required: `provider` (`workspace` or `orchestrator`) and `resource`. Optional: flat primitive/bound
`params`, `visible_when`, `action_dialog`, `on_success`, `on_error`, `depends_on`, `refresh_on`, and
provider-only polling of at least five seconds. Nested params are not supported. Read the exact
provider catalog before naming a resource.

For workspace action-set resources (`workflow_action`, `record_create_action`, and
`app_member_access_action`), `visible_when` is a non-empty list of bound conditions. Every condition
must pass or the source resolves to an empty action set. Operators are `equals`, `not_equals`,
`is_empty`, and `is_not_empty`; only the first two accept a primitive `value`:

```yaml
visible_when:
  - {bind: source.issue.record.locked, operator: not_equals, value: true}
```

`action_dialog` controls generated action dialogs; its provider-specific options are documented in
the selected provider catalog.
