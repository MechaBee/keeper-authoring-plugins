# Workspace Provider Catalog

Prefer plain `table` and `record` sources for ordinary rows. Use these documented resources when a
uniform provider result or generated action set is required:

| Resource | Resolves to / use |
| --- | --- |
| `table` | Provider-shaped table query |
| `record` | Provider-shaped record query |
| `record_create_action` | Create `action_set`, commonly for `record_collection.create` |
| `workflow_action` | Workflow `action_set`; requires `workflow_id` |
| `agent_task_action` | [AI task](../../automation/task.md) `action_set`; requires `task_id`; presets inputs with `input__{field}`; `team` (`writer`, `researcher`) hands a [delegable](../../automation/task.md#procedures-a-team-can-carry-out) task to that agent team instead; hidden while the team is off or not set up |
| `app_member_access_action` | Admin-only app membership activate/deactivate `action_set` |
| `file` | `workspace_file`; requires `path` (an empty bound path resolves to an empty file; PDFs, images and binaries resolve without content and preview from their bytes) |
| `file_collection` | File list; exactly one of `pattern` (a glob) or `folder` (a folder path, usually record-bound), optional `recursive` |
| `file_collection_groups` | Grouped file lists from a table of patterns |
| `collection_documents` | One [collection](../../schema/roles.md) and its documents, synced with its folder; `collection_id`. For [`collection_view`](../components/collection-view.md) |
| `document` | One document with its body; `document_id`. For [`document_page`](../components/document-page.md) |
| `linked_documents` | A record's own collection and links; `table`, `record_id`, `link_table`, optional `collection_field`. For [`linked_documents`](../components/linked-documents.md) |
| `comments` | One record's comments; `table` (a comment-role table), `target_id`. For [`comments`](../components/comments.md) |

The document collection components run their own actions (create, upload, save, move, attach,
delete, link, comment, resolve); views declare no action sets for them. A body save refreshes
nothing so the editor keeps its draft; every other change refreshes the view.

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

## Step-by-step dialogs: `action_dialog.layout: steps`

A `workflow_action` whose job takes several decisions can show the workflow's `input_sections` one
at a time instead of one long form. Each section is a step, and its `title` is the step's label.
The last step is Review: the entered values, section by section, with a Change link on each, and the
workflow preview when it has one. Nothing is saved until Review's button, which carries the action's
label.

```yaml
add_scenario_action:
  kind: provider_resource
  provider: workspace
  resource: workflow_action
  params:
    workflow_id: add_scenario_to_task
    label: Add the scenario
    description: Pick a queued task or start a new one, then write the scenario.
  action_dialog:
    layout: steps
    done:
      title: The scenario is ready
      message: It runs the next time someone works the task.
      links:
        - {label: Open the scenario, viewId: scenario, query: {scenarioId: {bind: action.result.scenario_id}}}
        - {label: Open the task, viewId: task, query: {taskId: {bind: action.result.task_id}}}
```

- The workflow needs at least two `input_sections`, each with a `title`, and every input the dialog
  shows must be in one of them; otherwise verification reports `VIEW_ACTION_STEPS_INVALID`.
- A section hidden by its `visible_when` drops out of the steps, so a two-way `input.variant: switch`
  ([fields](../../schema/fields.md)) plus `visible_when` on each mode's sections gives one flow two
  paths.
- Next checks only the current step's required fields and rules. A field error from the server goes
  back to the step that holds the field.
- The `description` param is a sentence under the dialog's title, and the text of the action's
  [flow card](../components/toolbar.md#flow-cards).
- `layout: steps` is for `workflow_action` only.

### Ending on a done screen: `action_dialog.done`

With `layout: steps`, `done` replaces closing the dialog with a confirmation. Say what happens next
("You'll get a notice when it finishes"), not what was just saved.

- `title` (required) and `message` are plain text.
- `links` (1 to 3) each take a `label`, a `viewId` and an optional `query`. A query value is a plain
  value or a binding to `action.result.<field>`, the workflow's `result`; the first link is the
  primary button.
- The done screen shows after the workflow **and** its `on_success` follow-ups finish. If a
  follow-up fails, the screen says the record is saved and what didn't happen, in place of the
  message.
- An `on_success` `navigate` does not run when there is a done screen (warning
  `VIEW_ACTION_DONE_SKIPS_NAVIGATE`); offer that view as a link instead.

### Handing the saved record to a team

When the action's `on_success` [gives the saved record to a team](../../automation/task.md#give-a-record-to-a-team)
(`start_agent_team_assignment` with a fixed `team`), the flow says so before anything is saved:
Review ends with "…and the Tester starts on it (up to $2.00 for this run)". The action is disabled,
with the reason, when that team is off, not set up, or not open to the viewer. A team chosen at run time (`team: {bind: ...}`) is checked only when it runs.

```yaml
  on_success:
    - type: provider_action
      provider: workspace
      action: start_agent_team_assignment
      params: {team: tester, table: test_tasks, record_id: {bind: action.result.id}}
```

To give a guided flow the whole page instead of a dialog, put it on a [flow page](../components/flow.md).

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
