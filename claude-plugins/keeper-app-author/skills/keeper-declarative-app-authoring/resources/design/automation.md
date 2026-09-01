# Design: Automation

Create automation only when the brief asks for it. When it does, pick the *lightest* mechanism that
produces the result. Decide in this order — the first match wins.

| The result is… | Reach for | Read |
| --- | --- | --- |
| model-generated content (a summary, a draft, a classification) | an **agent** (`templated_prompt`) with declared `writes` | [`../contracts/workflows/agent.md`](../contracts/workflows/agent.md) |
| a field value derived from other fields *while the user edits*, with no write of its own | a **compute block** on the `record_detail` / `record_form` | [`../contracts/bindings/compute.md`](../contracts/bindings/compute.md) |
| a single-record mutation triggered from that record's surface, with no cross-record or lifecycle logic | a **direct `provider_action`** in the detail/collection actions | [`../contracts/actions/provider-action.md`](../contracts/actions/provider-action.md) |
| a deterministic write that spans records, enforces a lifecycle, or is a table's only allowed write path | a **workflow** | [`../contracts/workflows/workflow.md`](../contracts/workflows/workflow.md) |

Read this decision the other direction to catch the common mistakes:

- **Do not use an agent for a deterministic result.** If the output is computable from the record,
  it is a compute block or a workflow, not a model call. Reserve agents for genuinely generated text.
- **Do not use a compute block to persist across records.** Compute derives values for the record
  being edited; anything that writes another table is a workflow.
- **Do not use a direct action when the table is workflow-only.** If the table's `mutationPolicy`
  pins writes to a `workflow` channel, the mutation must be a workflow in that `workflowIds` list —
  a direct action will be rejected. See [`data-and-access.md`](data-and-access.md).
- **Do not turn a one-record update into a whole-table replacement.** A workflow step mutates the
  named record; it never rewrites the table.

An agent surfaces through an `agent_action_panel`; a workflow surfaces through a workflow action on a
record surface. Cross-check every input, step, table, alias, result key, and write field against the
contract before validating.
