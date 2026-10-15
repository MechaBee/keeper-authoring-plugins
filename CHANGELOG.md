# Changelog

All notable changes to the MechaBee Keeper plugins are documented here. Entries without a plugin
name in the heading are Keeper App Author releases.

## Keeper Workspace Content 1.4.1 - 2026-10-15

- The skill and plugin descriptions now say when to use them: saving, reporting or logging work
  into MechaBee or Keeper apps (for example a session's progress or a status update), and looking
  up or reviewing what is recorded there. A new session can find the right app procedure from a
  plain request such as "push this session's progress to my projects", without naming the plugin.

## Keeper App Author 1.9.0 - 2026-10-15

- New `record_gantt` view component: a timeline of records from start to end date, with milestones
  for end-only rows, open bars for start-only rows, dependency arrows from a links data source
  (`reverse_kinds` lets one table mix "blocks" and "needs"), a day/week/month scale and a today
  line. It is read-only and becomes a week-by-week list on phones. Reference page
  `reference/views/components/record-gantt.md`; app verification checks the date fields and the
  dependency references.
- Exposed procedures are found by their descriptions: `app_list` returns each app's
  `description`. The skill says to write an app description as what the app is for, and a
  procedure description as when to use it, in the person's words, never as a plugin command.

## Keeper Workspace Content 1.4.0 - 2026-10-15

- When the person asks to record, report or look up work without naming an app, the skill matches
  the request against each app's `description` and then each procedure's `description`.

## Keeper App Author 1.8.0 - 2026-10-15

Deploying is now fast for whole apps: file content no longer travels through the conversation.

- Upload by reference: `app_upload_begin` takes each file's path, sha256 and size, rejects every
  disallowed path at once before any content is sent, reuses unchanged installed files, and returns
  a short-lived upload capability for the rest. `app_upload_prepare` and `app_diff` accept the
  returned `bundleId`; inline `files` remain for small edits.
- `app_upload_prepare` validates, diffs and stages in one call; the skill no longer sends the same
  candidate through `app_validate` and `app_diff` first.
- Prepare, apply and `app_get` return a sha256 and size per file, so the result can be checked
  against the local copy without reading it back.
- Stages last about a day; new `app_upload_status` reports whether the app changed since prepare
  and `app_upload_renew` extends a current stage.
- `app_download` with `delivery: "link"` returns a download capability and per-file hashes instead
  of the content, for editing an installed app in a local folder; `includeDocuments` adds the app's
  document tree to full downloads.
- Additive data import for JSONL apps: `app_upload_begin` with `purpose: "data_import"`, then
  `app_data_import_prepare` (new, identical and conflicting rows per table, documents, unknown
  people) and `app_data_import_apply`. Rows keep their ids and values; people are remapped with
  `identityMap`; nothing installed is overwritten, and a repeated import is a no-op.
- The contract's allowed-file list now includes `ai/<id>.md` task guides.
- New helper `scripts/keeper-app-bundle.mjs` (Node.js 18+, no dependencies): `manifest`, `upload`,
  `download` and `verify`. The skill documents the wire format, so equivalent tooling works too.
- The skill states its requirements: authoring and deployment need an agent with a shell, a local
  working folder and Node.js 18+; it tells the user up front when the agent lacks them.
- Requires a Keeper server with these tools (MCP server 0.8.0). No scope or authentication change.

## Keeper App Author 1.7.0 - 2026-10-09

- Views can be shared with connected agents: `exposure: {mcp: true}` lets agents read a view's
  data with `app_view_list` and `app_view_read` (Workspace Content), with the reader's own access.
  The view's routed state keys are its parameters.
- `ui.focus: true` on a Markdown `record_detail` field adds a full-screen Focus view for reading and
  writing.
- `fields: []` beside a `header` makes a header-only `record_detail` card.
- The task reference notes that connected agents see an exposed task as a procedure.
- No MCP tool, scope, or authentication change in this plugin.

## Keeper Workspace Content 1.3.0 - 2026-10-09

- Exposed app tasks are now procedures, so they no longer read like an app's own task records:
  `app_procedure_list`, `app_procedure_get`, `app_procedure_input_options`,
  `app_procedure_prepare` (`procedureId`, `procedureRevision`), then `app_run_get`,
  `app_run_document_read`, `app_run_document_write`, `app_run_submit` and `app_run_cancel`. The
  `app_task_*` tools are removed.
- Pick the app first: new `app_list` lists the apps you can open without loading them, and
  `app_procedure_list` requires `appId` and loads only that app. An app that can't be opened
  returns `app_unavailable` with its reason instead of failing the whole listing.
- New read-only tools `app_view_list` and `app_view_read`: list one app's views shared with agents
  and read one's data (records with reference labels, comments, documents) with your own access.
- The skill explains when to read a view instead of preparing a task.
- Read scope only; no new scope or authentication change.

## Keeper App Author 1.6.0 - 2026-10-08

- AI tasks can propose changes to many existing records: a `many` update output takes its ids from
  a table context (`id: {in: context.<tableAlias>}`); each row names its record and only the fields
  it changes, and the review shows each row as old → new.
- New workflow step `update_records` saves many updates, and changes several rows without
  rewriting the table.
- A task input's `reference_where` narrows what a connected agent can pick from
  `app_task_input_options`, and preparing a run with another row is refused.
- New workflow binding `system.nowLocal`: now as a `datetime` field value in the requester's time
  zone.
- No MCP tool, scope, or authentication change.

## Keeper Workspace Content 1.2.1 - 2026-10-08

- `app_task_input_options` lists only the rows the app allows for an input, such as the steps
  ready for the agent; the skill says an empty list means there is nothing to do.
- No new tool, scope, or authentication change.

## Keeper App Author 1.5.0 - 2026-10-08

- Document collections: new reference pages for table roles (`collection`, `document`,
  `document_link` and `comment`, with managed fields, the `json` type and the `comments:` block),
  the `collection_list`, `collection_view`, `document_page`, `linked_documents` and `comments`
  components with their workspace resources, and the AI task `documents` context and document
  outputs (`op: create` and `op: revise`). Keeper writes the documents; a revision is accepted only
  on the text the AI read.
- App design guidance: when to use collections rather than `doc_page`, and `comment_thread` as the
  pattern for an activity timeline that includes comments (Issue Tracker, board example).
- Proposal Studio replaces Proposal Tracker (`examples/external-proposal/` is removed): a sales app
  on document collections where each opportunity owns a collection, library documents are linked
  with a role and a note, discussion and review use comment tables, and connected agents draft and
  revise documents that Keeper saves.
- No MCP tool, scope, or authentication change.

## Keeper Workspace Content 1.2.0 - 2026-10-08

- Exposed app tasks can create and revise documents in an app's document collections. The agent
  returns each document's Markdown in the submitted result instead of writing a run file; Keeper
  names and writes it on save, and refuses a revision when the document changed after the agent
  read it. The skill's task steps and the `app_task_submit` description explain both output forms.
- No new tool, scope, or authentication change.

## Keeper App Author 1.4.2 - 2026-10-06

- Time Tracker example: add `notifications.yaml`, which sends the entry owner an inbox message when
  time is logged or updated for them, including entries an administrator adds on their behalf.
- Refresh the Time Tracker "What's in the app" guide: day-grouped My entries, project-default
  billable status, duplicate-entry details, and the task column in Team reports.
- Issue Tracker README no longer points at a repository-only path.

## Keeper App Author 1.4.1 - 2026-10-06

- Ship the complete exposed-task example, Proposal Tracker (`examples/external-proposal/`): an AI
  task exposed to connected agents, with document context, an `on_approval` commit workflow, the
  review card, and the workspace documents the task reads (in the example's `workspace/` folder).
- The task reference links to the shipped example instead of a repository-only path.

## Keeper App Author 1.4.0 - 2026-10-06

- Document AI tasks: apps can let people ask AI for work. New reference pages for the task
  descriptor (`agents/*.yaml` with `kind: task`, `ai/*.md` guides, and the `on_result`,
  `on_approval`, and `by_agent` commit modes), commit workflows (`agent_commit`, with `result.*` and
  `system.agentRun.*` bindings), the `agent` mutation channel, the `agent_task_action` resource, and
  the `agent_task_runs` component.
- Add an AI task pattern example and design guidance for choosing a commit mode. The
  templated-prompt agent is marked legacy.
- No MCP tool, scope, or authentication change.

## Keeper Workspace Content 1.1.0 - 2026-10-06

- Complete Keeper app tasks that an app author has exposed (`exposure: {mcp: true}`): discover a
  task, read its guide and scoped record and document context, write run-specific Markdown outputs,
  and submit results that Keeper validates and commits through the app's existing workflow, or
  holds for review in the app's task run card.
- Nine new `app_task_*` tools. The connected agent's own model does the work; Keeper launches no
  managed worker. No change to the content tools, scopes, or authentication.

## 1.3.0 - 2026-10-04

- Retain 1.3.0 for the initial public release; this version has not been submitted or publicly
  released. Production behavioral testing is scheduled separately.
- Clarify boolean workflow guards and optional member lookups, static input defaults, dynamic
  view presets, and authoritative server timestamps.
- Document app-member workflow reads and snapshot boundaries, the restricted principal directory,
  email privacy, and platform-owned references without app delete relations.
- Clarify browser sign-in for behavioral verification and retain workflow failure coordinates
  while distinguishing expected input rejections from unexpected execution failures.
- Document commit notifications: the optional `notifications.yaml` app file, its event rules,
  recipients and inbox/push copy, and how authoring and apply carry it forward alongside the guide.
- Add grouped tables to `record_table`: `group_by` break levels (optionally bucketed by day, week,
  month, or year) with per-group totals from the columns' existing `summary`, rendered as one
  framed block per group, plus a partial-group marker when a source limit may cut a group short.
- Add column `format: date | time | datetime` for showing one part of a date or datetime value, and
  describe how short columns now pack together while one column takes the spare width.
- Document workspace folders on records (`input.variant: workspace_folder`), folder-bound
  `file_collection` sources, and how PDFs, images, and other binary files preview.
- Document deadline (`due`) signals on board cards, `period_navigation.notices` on the weekly
  timesheet grid, and DynamoDB applies that return immediately when the serving plan is unchanged.
- Update the time-tracker example: day-grouped "My entries" with time-only start and end, and
  click-to-open entry editors in "My entries" and "My week". Add notifications to the issue-tracker
  example.

## 1.0.1 - 2026-07-30

- Refine the market-facing description around complete app authoring and review-first deployment.
- Add production Service Desk screenshots to the Codex listing metadata.
- Move installation, permissions, updates, and support to the dedicated App Author documentation.
- Add reviewer-ready positive and negative evaluation cases for public marketplace submission.

## 1.0.0 - 2026-07-30

- Publish the production Keeper App Author package for Codex.
- Publish a separate Claude Code package backed by the same Keeper MCP service.
- Add Git marketplace catalogs, install instructions, branded assets, and automated validation.
