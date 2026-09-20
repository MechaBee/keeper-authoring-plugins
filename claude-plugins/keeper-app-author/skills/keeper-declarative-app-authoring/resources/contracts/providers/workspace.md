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

## `action_dialog` preset groups

`workflow_action` and `record_create_action` may attach quick-fill presets to the generated dialog
under `action_dialog.preset_groups` (a non-empty array). Picking an item patches the dialog inputs;
presets never add fields the action does not already define.

Set `action_dialog.preview: false` to suppress the workflow preview panel for a `workflow_action`
dialog (it shows by default). `action_dialog` may carry `preview` on its own, without `preset_groups`.

```yaml
action_dialog:
  preset_groups:
    - id: recent_work                       # unique within the dialog
      label: Recent work                    # optional caption
      placement: {before_field: project_id} # exactly one of before_field | after_field
      presentation:
        variant: cards                      # chips | cards | list
        mode: inline                        # section (default) | inline
        primary_field: project_id           # cards/list main line (optional)
        secondary_field: task_id            # cards/list sub line (optional)
      source:
        kind: records                       # inline | records | generator
        data_source: recent_entries
        distinct_by: [project_id, task_id]
        limit: 4
        item:
          values:
            project_id: {bind: record.project_id}
            task_id: {bind: record.task_id, fallback: null}
      apply: {type: patch_input}            # always patch_input
    - id: quick_duration
      placement: {after_field: duration_text}
      presentation: {variant: chips, mode: inline}
      visible_when:
        - {field: entry_method, operator: equals, value: duration}
      source:
        kind: inline
        items:
          - {id: 15m, label: 15m, values: {duration_text: 15m}}
          - {id: 1h, label: 1h, values: {duration_text: 1h}}
      apply: {type: patch_input}
```

- **placement** anchors the group to one input field — `before_field` renders above the control,
  `after_field` below it.
- **presentation.variant** — `chips` for compact pills, `cards`/`list` for labelled options;
  `primary_field`/`secondary_field` choose which resolved input values a card shows.
- **presentation.mode** — `section` (default) gives the group its own caption + description;
  `inline` is a supportive treatment that drops the description, demotes `label` to a faint caption
  (shown only when present), and sits tight against the control. Prefer `inline` for quiet
  quick-fills; reserve `section` for presets that warrant a standalone heading.
- **source** — `inline` (literal `items` of `id`/`label`/`values`), `records` (`data_source` plus an
  `item` mapping of bound `values`, optional `distinct_by`/`limit`), or `generator` (`relative_dates`
  over `today`/`yesterday`/`tomorrow`).
- **visible_when** gates the group with the same conditions as dialog fields; **apply** is always
  `{type: patch_input}`.
