# Changelog

All notable changes to the MechaBee Keeper plugins are documented here. Entries without a plugin
name in the heading are Keeper App Author releases.

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
