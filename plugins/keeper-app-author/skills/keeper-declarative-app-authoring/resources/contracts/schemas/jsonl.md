# JSONL Data And Mutation Contract

Store records at `data/{table}.jsonl`, where `{table}` exactly matches `schemas/{table}.yaml` and
the schema's top-level `table`. Use one JSON object per line, no commas, with optional blank lines:
For example, `schemas/lead.yaml` with `table: lead` requires `data/lead.jsonl`, not
`data/leads.jsonl`.

```jsonl
{"id":"task_a","title":"Write docs","status":"todo"}
{"id":"task_b","title":"Review docs","status":"done"}
```

On create, unknown fields fail, readonly fields are ignored except an explicit primary key may be
honored, required writable fields must be present after coercion, and an empty primary key is
generated from `idPrefix`. On update, a validated patch merges into the stored row, preserves the
primary key, and retains pre-existing extra JSONL keys. Delete defaults to relation-aware block.

Workspace table queries support equality filters, one-field sort, and limit. They do not support
partial text search, ranges, joins, or multi-field sort. Use a read-only projected table when those
needs cannot be expressed by a plain source.
