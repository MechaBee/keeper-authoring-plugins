# Schema Evolution Contract

Inspect the schema, every JSONL row, and all view/workflow/agent references before migration.

- Add field: decide whether old rows need backfill; backfill before making it required.
- Rename field: migrate every JSONL key and all filters, sorts, components, bindings, agents, and
  workflows in the same change.
- Remove field: remove descriptor references first; check `primaryKey`, `displayField`, relations,
  and stored keys.
- Tighten select options: migrate stored values before removing options.
- Change primary key: treat as a full migration of rows, relations, routes, actions, agents, and
  workflows; avoid when possible.
- Change `idPrefix`: existing rows remain valid; only future generated ids change.

Never claim a migration is safe without checking actual stored rows. Retain preimages or another
rollback route for destructive rewrites.
