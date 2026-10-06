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
`input_sections`, `input_defaults`, `preview`, `result`, `on_success`, `on_error`,
`success_message`, and `invalidate: "*"|[...]`.

A workflow with `agent_commit: {task, point?}` is an [AI task](task.md) commit workflow: it may bind
`result.*` and `system.agentRun.*`, has empty `input_fields` and no `allowed_roles`, and only Keeper
runs it.

Input sections group existing input field ids, may set `columns` (1–3), and may use `visible_when`. Preview/result names a
step and optional dotted `path`. Follow-up actions use the [component action reference](../views/actions/index.md). Read
[`steps.md`](steps.md) for the closed step vocabulary.

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
