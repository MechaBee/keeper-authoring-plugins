# Syntax Reference

Choose the layer being changed, then the exact page needed. Each page describes supported syntax
and semantics; it does not prescribe a whole app or replace the live MCP contract and diagnostics.

| Layer | Entry point | Owns |
| --- | --- | --- |
| Application | [App manifest](application/app.md) | App identity, files, default view; [guide declarations](application/user-guide.md) |
| Schema | [Schema](schema/index.md) | Tables, fields, relations, JSONL, integrity and evolution |
| Views | [Views](views/index.md) | Screens, components, data sources, providers, bindings, actions, navigation |
| Automation | [Automation](automation/index.md) | Workflows, steps, agents; choice of execution mechanism |
| App security | [App security](security/index.md) | Membership, row scope, mutation restrictions, view access, share links |
| Storage | [Storage](storage/index.md) | Engine intent and logical query paths |

The schema declares security and storage properties, but their detailed syntax is owned by those
layers and linked from [table.md](schema/table.md). Component and view properties remain under
views. Deployment tool sequences are owned by [Apply](../workflows/apply.md), not this reference.
