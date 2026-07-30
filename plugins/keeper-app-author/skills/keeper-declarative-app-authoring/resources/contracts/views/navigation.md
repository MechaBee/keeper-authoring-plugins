# View Navigation Contract

Top-level `nav` controls global navigation:

```yaml
nav:
  visible: false
  title: Optional alternate label
  order: 20
  preserve_route_keys: [tenantId]
```

All keys are optional. `visible: false` hides a contextual destination. Omitting `nav`, or omitting
`visible`, leaves the view visible. Never use `view.nav` or `view.show_in_nav`; the runtime ignores
both shapes.
`preserve_route_keys` is `"*"` or a list of safe route keys.

Use the framework view switcher for ordinary visible peers. Use a toolbar `link` or a `navigate`
component action for a hidden destination or contextual jump. Contextual actions must pass required
ids explicitly:

```yaml
- type: navigate
  viewId: item-detail
  query:
    itemId:
      bind: record.id
```

Navigation replaces route params with the supplied query plus `workspaceId`; unrelated params are
not preserved automatically. `null` and empty strings are omitted, while `0` and `false` remain.
The destination view must bind the query through `route_state` or directly through `route.*`.

A queryless toolbar link to a visible peer duplicates global navigation and produces a warning.
A queryless link to a hidden Add/Create destination is permitted when it is the only way to reach
that screen.
