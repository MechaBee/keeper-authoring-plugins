# Keeper Component And Layout Index

This is the component-to-contract index. **Decide *which* component a view needs in
[`design/shape-and-views.md`](design/shape-and-views.md)** (archetype, per-view selection, and the
anti-patterns); use the table below to find the contract for the component you chose. Do not load
every component file. A Keeper view is a composition container; a board, table, or detail surface is
a component, not a separate view descriptor type.

## Component contracts by interaction

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

Archetype selection and the runnable example for each screen shape live in
[`design/shape-and-views.md`](design/shape-and-views.md). Once components are chosen, also read
[`contracts/views/layout.md`](contracts/views/layout.md),
[`contracts/views/navigation.md`](contracts/views/navigation.md), and the exact data-source and
action contracts referenced by the selected components.
