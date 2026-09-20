# Data Sources

| Kind | Reference |
| --- | --- |
| `table` | [Workspace table query](table.md) |
| `record` | [One record](record.md) |
| `projected_table` | [Read-only joins and derivations](projected-table.md) |
| `aggregate_table` | [Grouped counts and numeric summaries](aggregate-table.md) |
| `provider_resource` | [Provider resource](provider-resource.md) |

Provider resource/action names are closed vocabularies. Read the selected provider:
[workspace](../providers/workspace.md) or [orchestrator](../providers/orchestrator.md).
Read completeness and performance intent are documented with [table queries](table.md).
Projections are read-only; perform mutations against authorized base records.
