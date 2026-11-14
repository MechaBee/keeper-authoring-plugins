# Workflow Descriptor Reference

One file at `workflows/{workflowId}.yaml` defines a multi-step workspace mutation:

```yaml
id: complete-task
title: Complete task
appearance: default
input_fields:
  - {id: task_id, type: text, label: Task ID, required: true}
steps:
  - id: update_task
    kind: update_record
    table: tasks
    record_id: {bind: input.task_id}
    values: {status: done}
result: {step: update_task}
success_message: Task completed.
invalidate: [tasks]
```

Required: id matching filename, `title`, `input_fields` array, and non-empty `steps`. Optional:
`appearance: default|secondary|destructive`, `allowed_roles` (non-empty array of roles permitted to
run it), `actor_required` (require a resolved actor so `system.actor*` bindings resolve),
`input_sections`, `input_defaults`, `prefill`, `preview`, `result`, `on_success`, `on_error`,
`success_message`, and `invalidate: "*"|[...]`.

A workflow with `agent_commit: {task, point?}` is an [AI task](task.md) commit workflow: it may bind
`result.*` and `system.agentRun.*`, has empty `input_fields` and no `allowed_roles`, and only Keeper
runs it.

Input sections group existing input field ids, may set `columns` (1–3), may use `visible_when`, and may set
`tone: neutral|info|success|warning|danger` to tint the section's box (e.g. a read-only summary of the record the action
starts from, above the editable inputs; omit it for the plain box). Preview/result names a
step and optional dotted `path`. Follow-up actions use the [component action reference](../views/actions/index.md). Read
[`steps.md`](steps.md) for the closed step vocabulary.

## Start from an existing record: `prefill` and record sections

A workflow that starts from a record (duplicate an entry, follow up on an issue) declares once how
its dialog fills itself, so each view that offers it passes only the record id:

```yaml
input_fields:
  - {id: entry_id, type: text, label: Entry, required: true, readonly: true}
  - {id: work_date, type: date, label: New date, required: true}
  - {id: start_time, type: time, label: Start}
  - {id: description, type: text, label: Description}
prefill:
  from: entry_id            # the input holding the record id
  table: time_entries       # optional when entry_id is a reference input
  inputs: {work_date: work_date, start_time: started_at, description: description}
input_sections:
  - id: original
    title: Original entry
    tone: info
    columns: 3
    fields: [entry_id]       # may be [] in a record section
    record:
      fields:
        - {field: work_date, label: Date}
        - {field: started_at, label: Start, format: time}
        - description
  - id: copy
    title: New entry
    fields: [work_date, start_time, description]
```

```yaml
# each view
duplicate_entry_action:
  kind: provider_resource
  provider: workspace
  resource: workflow_action
  params:
    workflow_id: duplicate_time_entry
    input__entry_id: {bind: state.selected_entry_id}
  action_dialog: {hidden_inputs: [entry_id]}
  refresh_on: [state.selected_entry_id]
```

When the dialog is built, Keeper reads that record with the viewer's own access and fills each
mapped input. A `date` input given a datetime takes its date part and a `time` input its `HH:MM`;
other values pass through. A view's own `input__<id>` still wins over the prefill. A section's
`record` shows the same record read-only: field ids, or `{field, label?, format?: date|time}`,
with reference labels resolved. `record.from` and `record.table` default to the prefill's. If no
id is given or the viewer can't read the record, the dialog opens unfilled and the summary says
the record is unavailable; the workflow's own steps still check the record when it runs. Prefill
only fills the dialog: an agent or a direct run still passes every input. Do not add read-only
copies of the record's fields as inputs just to show them; use a record section.

## Static defaults, dynamic presets, and server timestamps

`workflow.input_defaults` contains static primitives (including null) or string arrays. It does
not evaluate binding objects. For a user-editable communication timestamp, a view can preset a
workflow input dynamically through the flat workspace provider parameter:

```yaml
new_communication:
  kind: provider_resource
  provider: workspace
  resource: workflow_action
  params:
    workflow_id: log_communication
    input__occurred_at: {bind: context.nowIso}
```

The view evaluates this preset when resolving the action; it is not an authoritative submit-time
clock. The workflow must declare `occurred_at` in `input_fields`. For a server-owned timestamp,
bind a write value to workflow `system.nowIso`, or use a readonly schema field with
`computed: {kind: now, on: create, format: iso}`. Omit system-owned timestamps from writable forms.
See [workspace actions](../views/providers/workspace.md) and [fields](../schema/fields.md).
