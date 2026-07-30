# Keeper File Contract Index

Read this index first. Then read only the contract files required by the assignment.
Contracts define valid YAML and JSONL. Patterns demonstrate composition but never add keys.

## Files

| Authoring target | Contract |
| --- | --- |
| App folder and `app.yaml` | [`contracts/app.md`](contracts/app.md) |
| Table schema | [`contracts/schemas/table.md`](contracts/schemas/table.md) |
| Field shapes and types | [`contracts/schemas/fields.md`](contracts/schemas/fields.md) |
| Relations and deletion | [`contracts/schemas/relations.md`](contracts/schemas/relations.md) |
| Seed and stored JSONL | [`contracts/schemas/jsonl.md`](contracts/schemas/jsonl.md) |
| View envelope | [`contracts/views/view.md`](contracts/views/view.md) |
| View navigation | [`contracts/views/navigation.md`](contracts/views/navigation.md) |
| Layout tree | [`contracts/views/layout.md`](contracts/views/layout.md) |
| View sharing | [`contracts/views/sharing.md`](contracts/views/sharing.md) |
| Workflow descriptor | [`contracts/workflows/workflow.md`](contracts/workflows/workflow.md) |
| Workflow step kinds | [`contracts/workflows/steps.md`](contracts/workflows/steps.md) |
| Templated-prompt agent | [`contracts/workflows/agent.md`](contracts/workflows/agent.md) |

## Cross-cutting contracts

- Choose an exact component in [`components-and-layout.md`](components-and-layout.md).
- Choose an exact data source or provider in
  [`projected-tables-and-providers.md`](projected-tables-and-providers.md).
- Read binding, state, route, and refresh rules through
  [`runtime-bindings-and-navigation.md`](runtime-bindings-and-navigation.md).
- Read mutation and migration rules through
  [`data-and-schema-evolution.md`](data-and-schema-evolution.md).

Use only safe identifiers: `[A-Za-z0-9_-]+`. Folder names, filenames, and descriptor ids
must agree. Unknown-looking keys are not capabilities even when a permissive parser ignores them.
