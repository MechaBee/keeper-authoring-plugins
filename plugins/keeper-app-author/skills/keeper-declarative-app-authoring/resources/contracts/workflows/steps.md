# Workflow Step Contracts

Every step requires a unique safe `id`, one documented `kind`, and optional `when` boolean or
workflow boolean binding. Workflow bindings use `input.*`, `step.*`, and the workflow `system.*`
bindings (`system.nowIso`, `system.actorUserId`, `system.actorEmail`, `system.appRole`,
`system.workspaceAccessMode`, `system.workflowId`; the `system.actor*` bindings require
`actor_required: true`).

| Kind | Required shape |
| --- | --- |
| `get_record` | `table`, bound `record_id` |
| `query_records` | `table`; optional equality `filter`, one-field `sort`, positive `limit`, and compiler-owned `performance` intent |
| `collect_records` | `table`, positive `maxRecords` (at most 10000); optional equality `filter`, one-field `sort`, and compiler-owned `performance` intent |
| `script` | synchronous JavaScript `code`; optional `label`, declared `input` |
| `create_record` | `table` and non-empty `values`, bound `values_from`, or both |
| `update_record` | `table`, `record_id`, and `values`, `values_from`, or both |
| `delete_record` | `table`, `record_id`; optional `mode: block|cascade` |
| `create_records` | `table`, bound `records_from` array |
| `replace_records` | `table`, bound `records_from` array |

Scripts receive only declared input and helpers; no ambient network or process APIs. Prefer
declarative record steps. Bulk replace rewrites a table and requires explicit user authorization
when existing data may be lost.

`query_records.performance` uses the same logical `intent` (`auto`, `indexed`, or `bounded_scan`)
and optional positive `maxFallbackRecords` bound as a table data source. It does not authorize or
describe physical DynamoDB indexes. Read [DynamoDB authoring](../../dynamodb-authoring.md) when the
workflow belongs to a DynamoDB app.

`query_records` is a page/limited read and must not be treated as a complete set. Use
`collect_records` only when workflow logic genuinely requires every matching record. Keeper follows
all transport pages under one stable revision and fails when the result exceeds `maxRecords`; it
never returns a silently truncated collection. Collect before writing the same table.

Workflow reads and writes are staged in memory. A workflow with staged writes submits one logical
all-or-nothing transaction fence, and read-only tables that informed those writes remain
revision-guarded at commit. A workflow with no staged writes performs no storage commit. DynamoDB
must fit the compiled physical transaction limits. JSONL uses a durable internal `PREPARED` image,
recovers an interrupted publication before serving records, and replaces the image with a compact
terminal head. These storage artifacts are Keeper-owned and never belong in an app candidate.
