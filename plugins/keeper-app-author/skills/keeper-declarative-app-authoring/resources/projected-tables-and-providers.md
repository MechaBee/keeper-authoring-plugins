# Keeper Data Source And Provider Index

Most JSONL apps need only `table` and `record`. Read projected/provider contracts only when the
brief needs joins, generated action sets, workspace files, app agents, or live orchestrator data.

## Data-source kinds

| Kind | Read |
| --- | --- |
| `table` | [`contracts/data-sources/table.md`](contracts/data-sources/table.md) |
| `record` | [`contracts/data-sources/record.md`](contracts/data-sources/record.md) |
| `projected_table` | [`contracts/data-sources/projected-table.md`](contracts/data-sources/projected-table.md) |
| `provider_resource` | [`contracts/data-sources/provider-resource.md`](contracts/data-sources/provider-resource.md) |

## Providers

- Workspace tables, workflows, agents, and files:
  [`contracts/providers/workspace.md`](contracts/providers/workspace.md).
- Live orchestrator resources and actions:
  [`contracts/providers/orchestrator.md`](contracts/providers/orchestrator.md).

Projected tables are read-only. Provider resource and action names are closed vocabularies; never
invent one from a desired feature.
