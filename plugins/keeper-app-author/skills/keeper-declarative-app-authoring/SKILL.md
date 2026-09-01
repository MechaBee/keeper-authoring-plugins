---
name: keeper-declarative-app-authoring
description: Develop, inspect, download, validate, migrate, repair, safely upload, and open declarative Keeper applications through the Keeper MCP server. Use for Keeper workspace discovery or any app, schema, view, workflow, agent, provider, JSONL authoring, deployment, preview, or launch task.
---

# Keeper Declarative App Authoring

Author through the Keeper MCP tools. Do not write directly into a repository or workspace
filesystem when the MCP server is available. Treat the MCP runtime contract and validation
diagnostics as authoritative over this bundled reference material.

## Start every task

1. Read [the MCP authoring workflow](resources/mcp-authoring-workflow.md).
2. Use the single Keeper MCP server bundled with this plugin for the entire task. Complete the
   Codex OAuth sign-in when prompted. Never paste Cognito tokens into prompts or repository files.
3. Call `contract_read` before constructing or changing a candidate.
4. Call `agent_list`. If exactly one agent is returned, select it. If several are returned, present
   their names and identifiers and ask the user to choose. Do not invent an agent identifier.
5. Call `workspace_list` for the selected agent. Use `recommendedWorkspaceId` when it is present.
   Otherwise present the visible workspaces and ask the user to choose an exact `workspaceId`.
6. Call `app_list` with the selected `agentId` and `workspaceId`.
7. For an existing app, call `app_get`, inspect `effectiveAccess`, then call `app_files_read` with
   `contentScope: "definitions"` before editing. Preserve the returned definition revision and
   source set.

Existing applications might include existing user data in `data/*.jsonl` that you must handle with
care according to user intent, app authority, and instructions:

- Default existing-app work to `contentScope: "definitions"` and `dataMode: "preserve"`. Never
  request, download, submit, or stage live JSONL for definition-only work. The server preserves it.
- A developer may read and stage definitions, but cannot read live data, change app roles, weaken
  existing row policies, or add an unrestricted table. Use schemas plus empty or synthetic mock
  rows to reason about the data contract.
- Request `contentScope: "full"` or use `dataMode: "replace"` only when `effectiveAccess` grants the
  corresponding raw-data capability and the user explicitly intends a live-data redesign or
  migration. Review the data impact separately.
- A new app may include its initial seed JSONL in the same full candidate. Do not add seed plumbing
  when the requested app does not need seed records.

The server pins the domain for its deployment; never ask the user to supply it and never pass a
domain argument to a tool. Keep the selected `agentId` and `workspaceId` explicit throughout the
task. If discovery cannot select either one unambiguously, ask before querying or changing an app.
Never guess a write target.

## Design first, then read only the contracts needed

Make the design decisions in [the design index](resources/design/README.md) before opening leaf
contracts: choose the app archetype and each view's component, decide the storage engine and table
modeling and whether any write, validation, or index policy is warranted, and choose any automation
mechanism. Then start with the [file contract index](resources/file-contracts.md) and follow it to
the exact focused contracts those decisions require:

- Views and components: [component and layout index](resources/components-and-layout.md)
- Schemas and JSONL: [data and schema index](resources/data-and-schema-evolution.md)
- Bindings and navigation: [runtime index](resources/runtime-bindings-and-navigation.md)
- Projected tables and providers:
  [data-source and provider index](resources/projected-tables-and-providers.md)
- DynamoDB storage, conversion, deployment jobs, or repair:
  [DynamoDB authoring](resources/dynamodb-authoring.md)

Focused type files are authoritative. Do not infer keys from examples, related types, permissive
parsing, or desired UI. Read no unrelated type files and do not inspect sibling Keeper apps as
examples.

After reading contracts, use the [pattern index](resources/example-patterns.md) to select at most
one matching composition pattern. Patterns never add valid keys. Use the
[general authoring workflow](resources/keeper-authoring-workflow.md) for migrations and data risk.

## Composition rules

Choose the app archetype, each view's component, and the runnable example to anchor on in
[the design index](resources/design/README.md) and
[`shape-and-views.md`](resources/design/shape-and-views.md); read every descriptor of the one example
you pick and adapt only domain identifiers and labels while preserving binding and navigation
envelopes. Preserve each example's row-scoped mutation strategy; never turn a one-record update into
a whole-table replacement.

Two guardrails hold regardless of shape.

Binding roots such as `state`, `route`, `source`, `context`, `record`, and `action` are reserved
runtime vocabulary, never domain identifiers. A projected `path:` alias declared by `from.as` is
a separate contract.

For workspace-backed data, keep these identifiers exactly equal:

```text
schemas/{table}.yaml
table: {table}
data/{table}.jsonl
```

## Candidate completeness

For a new app, produce `app.yaml`, all required schemas, and every view, action, and navigation
descriptor required by the brief. Do not stop after the default view. Include workflows, agents,
providers, and seed data only when requested, but complete each requested feature in the same
candidate. New team tables use schema version 2 and explicit `rowAccess`; prefer owner scope for
member-owned hours, expenses, submissions, and similar records. When a brief requires access from
a direct assignment or group membership, read the table-schema contract and use its constrained
`rowAccess.mode: policy` form. Never imitate resource policy with view filters, workflow code, or
an app-defined expression.

Every new `app.yaml` must materialize the deny-by-default app policy:

```yaml
access:
  default_role: none
  users: []
```

Broaden `default_role` or add users only when the approved brief explicitly requires that access.
Do not add the workspace owner or a `manage` collaborator merely to preserve their authority;
Keeper grants those workspace modes implicit app-admin capabilities.

Keep IDs aligned with filenames and cross-check every reference before validation. Pass files as
complete UTF-8 `{path, content}` entries; do not send partial patches.

## Validate and upload safely

Before validating, run the design-fitness gate in [`design/review.md`](resources/design/review.md)
and fix any design issue it surfaces — `app_validate` proves the candidate is legal, not that it is
well-designed. Then use this sequence:

1. `app_validate` the complete candidate.
2. Fix all validation errors; do not suppress or reinterpret diagnostics.
3. `app_diff` against the selected workspace.
4. For an existing definition change, use `dataMode: "preserve"` and omit JSONL. Choose `replace`
   when the submitted definitions are the complete desired definition state, or `merge` for an
   explicitly partial definition overlay.
5. Use `dataMode: "replace"` only for an explicitly authorized app-admin data replacement and only
   with upload `mode: "replace"`.
6. Call `app_upload_prepare` only when the user asked to create, update, upload, or publish.
7. Report the prepared diff, including added, modified, deleted, and unknown paths.
8. Call `app_upload_apply` only after the user has authorized applying that reviewed change.
9. Pass `expectedRevision` equal to the prepared `baseRevision`, and acknowledge exactly every
   modified or deleted path.

For a JSONL app, a successful apply returns the launch descriptor. For a DynamoDB app, apply instead
accepts a durable deployment job. Call `app_job_advance` repeatedly for that exact job while the
user wants processing to continue, and use `app_job_status` for read-only telemetry. Call
`app_url_get` only after the job is `COMPLETED`. Read [DynamoDB authoring](resources/dynamodb-authoring.md) before creating,
converting, repairing, or changing a DynamoDB-backed app.

Never retry a stale apply by weakening concurrency checks. Prepare a fresh upload and show the new
diff. Definition-only stages intentionally tolerate concurrent record activity; data-replacement
stages do not. Stages are signed and bound to the exact OAuth authorization, so never edit, copy,
or reuse a stage from another authorization. Abort an unused stage with `app_upload_abort`.

## Open a deployed app

After a successful `app_upload_apply`, present its `launch.url` as a clickable
**Open deployed app** link. The launch descriptor identifies the `agentId`, `workspaceId`, `appId`,
and default `viewId`; do not replace `agentId` with a product identifier.

For an already installed app, call `app_url_get`. Omit `viewId` to use `app.yaml` `defaultView`,
or pass an exact installed view when the user named one. When the user asks to open, preview, show,
or test the app and the in-app browser is available, open `launch.url` and show the resulting page.
When the user asks only for the URL, return the clickable link without opening a browser.

MechaBee web sign-in is separate from Keeper MCP authentication. If the launch opens a sign-in
page, keep that browser tab open and ask the user to complete sign-in there. Do not attempt to
enter, request, or infer the user's credentials. Continue in the same tab after the user signs in.
Never expose an MCP access token, put a token in the URL, or ask the user to copy credentials
between the two authentication contexts.
