# Keeper Data And Schema Index

Read only the references matching the requested data or migration work.

| Need | Read |
| --- | --- |
| Table envelope and identity | [`contracts/schemas/table.md`](contracts/schemas/table.md) |
| Field types, options, computed timestamps, coercion | [`contracts/schemas/fields.md`](contracts/schemas/fields.md) |
| Reference relations and delete behavior | [`contracts/schemas/relations.md`](contracts/schemas/relations.md) |
| JSONL naming, rows, create/update/delete behavior | [`contracts/schemas/jsonl.md`](contracts/schemas/jsonl.md) |
| Add, rename, remove, or tighten schema | [`contracts/schemas/evolution.md`](contracts/schemas/evolution.md) |

Schema filename, top-level `table`, and JSONL filename stem are one exact identifier. Treat field,
table, primary-key, and select-option changes as migrations when stored rows already exist.
