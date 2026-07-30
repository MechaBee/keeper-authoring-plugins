# Keeper Runtime Binding And Navigation Index

Read the exact runtime contract needed by the descriptor being authored.

| Need | Read |
| --- | --- |
| Binding roots and values | [`contracts/bindings/values.md`](contracts/bindings/values.md) |
| View state and route state | [`contracts/bindings/state-and-route.md`](contracts/bindings/state-and-route.md) |
| Dependencies, refresh, and polling | [`contracts/bindings/refresh-and-dependencies.md`](contracts/bindings/refresh-and-dependencies.md) |
| View visibility and contextual navigation | [`contracts/views/navigation.md`](contracts/views/navigation.md) |
| Component action arrays | [`contracts/actions/index.md`](contracts/actions/index.md) plus the exact action file |
| Reference rendering/editing | [`contracts/schemas/relations.md`](contracts/schemas/relations.md) |

Reserved binding roots are `state`, `record`, `route`, `source`, `context`, and—only in action
follow-ups—`action.result`. Never replace a reserved root with an entity or table name.
