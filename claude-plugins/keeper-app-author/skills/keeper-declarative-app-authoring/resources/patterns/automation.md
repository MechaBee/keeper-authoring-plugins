# Pattern: Workflow And Templated Agent

Create automation only when explicitly requested. Use a workflow for deterministic mutation and an
agent only for the declared model-generated result.

```yaml
# workflows/complete_work_item.yaml
id: complete_work_item
title: Complete item
input_fields:
  - {id: work_item_id, type: reference, label: Work item, referenceTable: work_items, required: true}
steps:
  - id: update_item
    kind: update_record
    table: work_items
    record_id: {bind: input.work_item_id}
    values: {status: completed}
invalidate: "*"
```

```yaml
# agents/draft_work_summary.yaml
id: draft_work_summary
title: Draft work summary
kind: templated_prompt
inputs:
  work_item:
    kind: record
    table: work_items
    id: {bind: input.work_item_id}
promptTemplate: |
  Write a concise Markdown summary using only this record:
  {{work_item}}
result:
  type: markdown
  key: draft_summary
writes:
  - key: work_item
    op: update
    table: work_items
    recordId: {bind: input.work_item_id}
    values:
      draft_summary: {bind: result.draft_summary}
```

Invoke the agent with `agent_action_panel` and supply `work_item_id`. Cross-check all workflow
inputs, steps, tables, agent aliases, placeholders, result keys, and write fields.
