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
`params`, `on_success`, `on_error`, `depends_on`, `refresh_on`, and provider-only polling of at
least five seconds. Nested params are not supported. Read the exact provider catalog before naming
a resource.
