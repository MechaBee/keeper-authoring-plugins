# Keeper Component And Layout Index

Classify the screen, then read the exact component contracts it uses. Do not load every
component file. A Keeper view is a composition container; a board, table, or detail surface is a
component, not a separate view descriptor type.

## Choose by interaction

| Interaction | Read |
| --- | --- |
| Dense browse | [`record-table.md`](contracts/components/record-table.md) |
| Compact list/card browse | [`record-list.md`](contracts/components/record-list.md) |
| Rows grouped by a select field | [`record-board.md`](contracts/components/record-board.md) |
| Small all-in-one CRUD surface | [`record-collection.md`](contracts/components/record-collection.md) |
| View or edit one record | [`record-detail.md`](contracts/components/record-detail.md) |
| Standalone create form | [`record-form.md`](contracts/components/record-form.md) |
| Weekly time matrix (rows × days) | [`timesheet-week-grid.md`](contracts/components/timesheet-week-grid.md) |
| Render record markdown | [`markdown-panel.md`](contracts/components/markdown-panel.md) |
| Run an app agent | [`agent-action-panel.md`](contracts/components/agent-action-panel.md) |
| Local controls | [`toolbar.md`](contracts/components/toolbar.md) and [`action-bar.md`](contracts/components/action-bar.md) |
| Provider stats | [`stats-grid.md`](contracts/components/stats-grid.md) |
| Provider timeline | [`timeline-panel.md`](contracts/components/timeline-panel.md) |
| Provider inbox thread | [`inbox-thread-panel.md`](contracts/components/inbox-thread-panel.md) |
| Provider hierarchy | [`tree-panel.md`](contracts/components/tree-panel.md) |
| One workspace text file | [`workspace-file-detail.md`](contracts/components/workspace-file-detail.md) |
| Workspace file list | [`workspace-file-collection.md`](contracts/components/workspace-file-collection.md) |
| Grouped file lists | [`workspace-file-collection-navigator.md`](contracts/components/workspace-file-collection-navigator.md) |

## Screen archetypes

- Board: read [`patterns/operational-board.md`](patterns/operational-board.md), then all of
  [`board-example/`](board-example/README.md).
- Business catalog: use `record_table`; add selection and `record_detail` only when needed.
- Record workspace: read [`patterns/record-workspace.md`](patterns/record-workspace.md).
- Dashboard/report: read [`patterns/dashboard.md`](patterns/dashboard.md).
- Small capture/CRUD surface: use `record_collection`; see the complete `hello-notes/` example.
- Separate list/detail/add/edit: read all of `four-view-crud/`.
- Multi-table operations desk: read all of `operations-desk/`; keep its projection sources
  read-only and workflows row-scoped.
- Effective-dated register: read all of `effective-dated-rules/`; keep logical identity, version
  history, and current snapshot as separate tables.

Also read [`contracts/views/layout.md`](contracts/views/layout.md),
[`contracts/views/navigation.md`](contracts/views/navigation.md), and the exact data-source and
action contracts referenced by the selected components.
