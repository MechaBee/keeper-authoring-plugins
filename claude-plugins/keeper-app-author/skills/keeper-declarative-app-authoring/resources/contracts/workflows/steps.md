# Workflow Step Contracts

Every step requires a unique safe `id`, one documented `kind`, and optional `when` boolean or
workflow boolean binding. Workflow bindings use `input.*`, `step.*`, and `system.nowIso`.

| Kind | Required shape |
| --- | --- |
| `get_record` | `table`, bound `record_id` |
| `query_records` | `table`; optional equality `filter`, one-field `sort`, positive `limit` |
| `script` | synchronous JavaScript `code`; optional `label`, declared `input` |
| `create_record` | `table` and non-empty `values`, bound `values_from`, or both |
| `update_record` | `table`, `record_id`, and `values`, `values_from`, or both |
| `delete_record` | `table`, `record_id`; optional `mode: block|cascade` |
| `create_records` | `table`, bound `records_from` array |
| `replace_records` | `table`, bound `records_from` array |

Scripts receive only declared input and helpers; no ambient network or process APIs. Prefer
declarative record steps. Bulk replace rewrites a table and requires explicit user authorization
when existing data may be lost.
