# View State And Route State Contract

Top-level `state` contains primitive initial values. State is persisted per workspace/app/view and
is appropriate for selected ids, filters, and local modes.

Map state keys to URL query keys with `route_state`:

```yaml
route_state:
  selectedTaskId: taskId
  statusFilter:
    route: status
    mode: sync
    omit_values: [all, ""]
```

String shorthand means `sync`. Modes are:

- `sync`: hydrate inbound, export on navigation, and update the URL while mounted.
- `hydrate`: read inbound only.
- `export`: export on navigation only.

`omit_values` contains primitives removed from generated queries. Explicit `navigate.query`
overrides automatic export. A collection selection stored in a synced state key becomes
deep-linkable and supports browser-back closing of overlay/mobile detail.
