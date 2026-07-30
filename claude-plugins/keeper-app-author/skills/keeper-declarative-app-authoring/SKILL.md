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

## Read only the contracts needed

Start with the [file contract index](resources/file-contracts.md), then follow it to the exact
focused contracts required by the brief:

- Views and components: [component and layout index](resources/components-and-layout.md)
- Schemas and JSONL: [data and schema index](resources/data-and-schema-evolution.md)
- Bindings and navigation: [runtime index](resources/runtime-bindings-and-navigation.md)
- Projected tables and providers:
  [data-source and provider index](resources/projected-tables-and-providers.md)

Focused type files are authoritative. Do not infer keys from examples, related types, permissive
parsing, or desired UI. Read no unrelated type files and do not inspect sibling Keeper apps as
examples.

After reading contracts, use the [pattern index](resources/example-patterns.md) to select at most
one matching composition pattern. Patterns never add valid keys. Use the
[general authoring workflow](resources/keeper-authoring-workflow.md) for migrations and data risk.

## Composition rules

For a board grouped by a select field, read the focused
[`record_board` contract](resources/contracts/components/record-board.md), then read every file
listed by the complete, data-free [board example](resources/board-example/README.md).

For separate list, detail, add, and edit screens, read every file listed by the canonical
[four-view CRUD example](resources/four-view-crud/README.md). Adapt only domain-owned identifiers
and labels while preserving binding and navigation envelopes.

For a multi-table operational application that truly needs a board, joined dashboard, related
record workspaces, workflows, sharing, and an agent writeback, read the complete
[operations-desk example](resources/operations-desk/README.md). Preserve its row-scoped mutation
strategy; do not turn one-record updates into whole-table replacement.

For stable logical records with dated successor versions and a materialized current read model,
read the complete [effective-dated-rules example](resources/effective-dated-rules/README.md).
Use this lifecycle only when the brief requires historical “valid on date” semantics.

For one small self-contained CRUD surface, use the
[hello-notes example](resources/hello-notes/README.md). Do not use `record_collection` for an
operational queue, complex record workspace, dashboard, or automation.

For every view, classify the interaction first:

- `record_collection`: genuinely small self-contained CRUD.
- `record_board`: rows grouped by a writable select field.
- `record_table` or `record_list`: browse.
- Route-bound `record_detail`: primary record workspace.

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
member-owned hours, expenses, submissions, and similar records.

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

Use this sequence:

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
