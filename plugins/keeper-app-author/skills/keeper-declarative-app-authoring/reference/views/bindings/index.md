# Bindings and State

| Need | Reference |
| --- | --- |
| Binding roots and values | [Values](values.md) |
| View state and route state | [State and route](state-and-route.md) |
| Dependencies, refresh and polling | [Refresh and dependencies](refresh-and-dependencies.md) |
| Derived values while editing | [Compute](compute.md) |

Binding roots are runtime vocabulary, not domain names. Keep `state`, `record`, `route`, `source`,
`context`, and context-specific `action.result` roots intact. A projection's `from.as`/`path` alias
is a different mechanism. Use [actions](../actions/index.md) for behavior and
[navigation](../navigation.md) for route destinations.
