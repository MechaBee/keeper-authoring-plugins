# Workspace Provider Catalog

Prefer plain `table` and `record` sources for ordinary rows. Use these documented resources when a
uniform provider result or generated action set is required:

| Resource | Resolves to / use |
| --- | --- |
| `table` | Provider-shaped table query |
| `record` | Provider-shaped record query |
| `record_create_action` | Create `action_set`, commonly for `record_collection.create` |
| `workflow_action` | Workflow `action_set`; requires `workflow_id` |
| `file` | `workspace_file`; requires `path` |
| `file_collection` | File list; requires `pattern`, optional `recursive` |
| `file_collection_groups` | Grouped file lists from a table of patterns |

The `params` map is flat. Use `field__{field}` for fixed/bound defaults and a comma-separated
writable `fields` value; never put `defaults:` under `record_create_action.params`:

```yaml
params:
  table: work_items
  label: New work item
  fields: summary,customer_id,priority,description
  field__status: requested
  field__priority: normal
```

Exclude primary keys, readonly/computed fields, and copied snapshot fields unless the brief
explicitly makes users maintain them. `workflow_action` may preset workflow inputs with
`input__{field}` params.

Documented manual actions are `create_record`, `update_record`, `delete_record`, `run_agent`,
`run_workflow`, `write_workspace_file`, and `delete_workspace_item`. Prefer `record_form` for a
standalone create screen, editable `record_detail` for updates, `agent_action_panel` for app-agent
runs, and generated action sets for workflows or complex inputs.
