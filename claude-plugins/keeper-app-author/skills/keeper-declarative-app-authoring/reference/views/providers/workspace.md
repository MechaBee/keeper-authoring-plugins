# Workspace Provider Catalog

Prefer plain `table` and `record` sources for ordinary rows. Use these documented resources when a
uniform provider result or generated action set is required:

| Resource | Resolves to / use |
| --- | --- |
| `table` | Provider-shaped table query |
| `record` | Provider-shaped record query |
| `record_create_action` | Create `action_set`, commonly for `record_collection.create` |
| `workflow_action` | Workflow `action_set`; requires `workflow_id` |
| `app_member_access_action` | Admin-only app membership activate/deactivate `action_set` |
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

## `app_member_access_action`

App membership is a platform capability. Every app administrator can manage it from the host's
**Access & sharing** surface; apps do not need an app-owned people table or this action to support
membership.

The host persists resolved membership by stable principal id in `keeper_app_access/v2`; email is
presentation and invitation fallback only. V1 email-only access documents remain readable and
upgrade on their next write.

Use the runtime-owned `keeper_app_members` table for app-scoped assignee, member, and resource-grant
options. It contains active, resolved principals who can currently open the app. Its row id and
`principal_id` are the stable Keeper principal id; it also exposes `display_name`, `role`, and
`membership_source`. `email` is populated only for app access managers. Pending email invitations
are absent because they cannot safely be stored as principal references.

When an admin-only app view genuinely needs a member-specific grant/remove button, bind the action
to the platform principal id. It changes control-plane membership only and never requires or
mutates an app profile:

```yaml
app_members:
  kind: table
  table: keeper_app_members

selected_member:
  kind: record
  table: keeper_app_members
  id: {bind: state.selected_principal_id}

selected_member_access_action:
  kind: provider_resource
  provider: workspace
  resource: app_member_access_action
  params:
    principal_id: {bind: source.selected_member.record.principal_id}
  depends_on: [selected_member]
```

The older profile-coupled form remains available for compatibility. Supplying `profile_id` opts
into synchronizing that profile row's `active` presentation field; `table` defaults to
`member_profiles`. Do not use this form in new apps. An app-owned profile is optional business
metadata, not the authority for app access.

```yaml
selected_member_access_action:
  kind: provider_resource
  provider: workspace
  resource: app_member_access_action
  params:
    table: members
    profile_id: {bind: source.selected_member.record.id}
    user_id: {bind: source.selected_member.record.user_id}
    active: {bind: source.selected_member.record.active}
```

Membership changes emit `app.member.added`, `app.member.removed`, `app.member.role_changed`, and
`app.member.invitation_pending`. Event identity is the stable principal when one exists; profile
records are never membership identity.

## `action_dialog` preset groups

`workflow_action` and `record_create_action` may attach quick-fill presets to the generated dialog
under `action_dialog.preset_groups` (a non-empty array). Picking an item patches the dialog inputs;
presets never add fields the action does not already define.

Set `action_dialog.preview: false` to suppress the workflow preview panel for a `workflow_action`
dialog (it shows by default). `action_dialog` may carry `preview` or `hidden_inputs` on its own,
without `preset_groups`.

`action_dialog.hidden_inputs` lists inputs the dialog does not render: the record the page is
already about, a mode the button's label already states, or a choice made by a preset group. Hidden
inputs still submit their preset parameter, workflow default, or preset-group value. Every required
hidden input must receive a value. When all inputs are hidden and there is no confirmation, clicking
the action runs it directly.

```yaml
lock_action:
  kind: provider_resource
  provider: workspace
  resource: workflow_action
  params:
    workflow_id: lock_conversation
    label: Lock conversation
    input__issue_id: {bind: state.issue_id}
    input__mode: lock
  visible_when:
    - {bind: source.issue.record.locked, operator: not_equals, value: true}
  action_dialog: {preview: false, hidden_inputs: [issue_id, mode]}
  depends_on: [issue]
```

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
