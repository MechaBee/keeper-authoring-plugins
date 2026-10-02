# Changelog

All notable changes to Keeper App Author are documented here.

## 1.3.0 - 2026-09-29

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
