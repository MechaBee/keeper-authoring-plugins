# Workflow Descriptor Contract

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

Input sections group existing input field ids and may use `visible_when`. Preview/result names a
step and optional dotted `path`. Follow-up actions use the component action contract. Read
[`steps.md`](steps.md) for the closed step vocabulary.
