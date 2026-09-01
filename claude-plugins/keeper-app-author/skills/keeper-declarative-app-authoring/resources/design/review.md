# Design: Fitness Review

Run this before `app_validate`. `app_validate` proves the candidate is **legal**; this proves it is
**well-designed**. Both are required — a candidate can pass validation and still be an awkward app.
Walk every item; fix the design before validating, do not defer.

## Reachability

- Every table is reached by at least one view or workflow. No orphan schema.
- Every workflow and agent is reached by an action, panel, or another step. No dead automation.
- Every nav-hidden view has something that routes to it (a `navigate` action passing its route key).
- `defaultView` is the natural first surface a user should land on — not a detail, admin, or edit
  view.

## Access fit

- Every member-owned record kind (hours, expenses, submissions, personal drafts) uses `owner` scope,
  not `all` plus a view filter.
- `mode: policy` appears only where a row is genuinely reached through an assignment or group — not
  as a heavier substitute for `owner` or `all`.
- No `mutationPolicy`, `validationPolicy`, or `constraint` is present that merely restates a weaker
  default, and none required by the brief's protection is missing.
- No view filter, workflow, or expression is standing in for real row access.

## Smallest shape

- No board, dashboard, extra table, workflow, agent, or policy the brief did not ask for.
- Exactly one composition example was used as the anchor (or two only if the brief independently
  required both operational coordination and effective dating).
- The chosen component matches each view's real interaction (see
  [`shape-and-views.md`](shape-and-views.md)) — no `record_collection` doing an operational queue's
  job, no board over a read-only source.

## Copy and coherence

- Every `title` and `description` is product microcopy, not a narration of configuration.
- No field is duplicated between a detail header meta row and a section.
- Identifiers agree across files: app folder = `app.yaml id`; `schemas/{table}.yaml` =
  `table: {table}` = `data/{table}.jsonl`; view/workflow/agent filenames = their ids.

When every item holds, proceed to the validation and upload sequence in
[`../mcp-authoring-workflow.md`](../mcp-authoring-workflow.md).
