# Templated-prompt Agent Reference

One file at `agents/{agentId}.yaml` defines the only supported Keeper agent kind:

```yaml
id: draft-summary
title: Draft summary
kind: templated_prompt
inputs:
  task:
    kind: record
    table: tasks
    id: {bind: input.task_id}
promptTemplate: |
  Summarize this task:
  {{task}}
result:
  type: markdown
  key: summary
writes:
  - key: persist_summary
    op: update
    table: tasks
    recordId: {bind: input.task_id}
    values:
      summary_md: {bind: result.summary}
```

`id`, `title`, `kind: templated_prompt`, non-empty `inputs`, `promptTemplate`, markdown `result`,
and `writes` are required. Inputs are `table` queries or one `record`; their bindings use
`input.*`, `result.*`, or `system.nowIso`. Result requires `type: markdown` and `key`; optional
success/fallback fields control empty model output.

Writes are `create` with `values` or `update` with `recordId` and `values`. Every table, field,
input placeholder, result key, and write binding must exist. No other agent kind or arbitrary tool
execution is supported.
