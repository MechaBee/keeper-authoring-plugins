# Automation

Choose a mechanism only when the requested behavior needs it. Use the simplest mechanism that
produces that behavior and respects the table's write policy.

| Needed result | Use |
| --- | --- |
| Derived field while a person edits the current record | [Compute](../views/bindings/compute.md) |
| One direct record operation, without lifecycle orchestration | [Provider action](../views/actions/provider-action.md) |
| Deterministic lifecycle or multiple-record write | [Workflow](workflow.md) and selected [steps](steps.md) |
| Model-generated summary, draft or classification | [Templated-prompt agent](agent.md) |

An agent is for generated content, not deterministic calculation. A compute block does not persist
changes to other records. A workflow-only table must be written through a workflow admitted by its
[mutation policy](../security/mutations.md). Keep one-record updates row-scoped rather than
replacing the whole table.

Workflows may declare `allowed_roles`; see [workflow syntax](workflow.md). Role admission does not
replace row policy or the target table's mutation restrictions. Surface the chosen mechanism with
a documented action or component, and check input names, result keys, aliases, and target fields.
An optional [composition example](../../examples/patterns/automation.md) connects a workflow and agent.
