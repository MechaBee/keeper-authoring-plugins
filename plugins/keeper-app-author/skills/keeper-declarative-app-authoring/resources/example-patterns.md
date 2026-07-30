# Keeper Composition Pattern Index

Read contracts first. Patterns choose and connect valid types; they never define new keys.

| App or screen shape | Read |
| --- | --- |
| Minimum app, schema, and default view | [`patterns/app-foundation.md`](patterns/app-foundation.md) |
| Rows grouped by a select field | [`patterns/operational-board.md`](patterns/operational-board.md), then all of [`board-example/`](board-example/README.md) |
| Route-bound primary record and workflow action | [`patterns/record-workspace.md`](patterns/record-workspace.md) |
| Read-only joined dashboard | [`patterns/dashboard.md`](patterns/dashboard.md) |
| Workflow plus templated-prompt agent | [`patterns/automation.md`](patterns/automation.md) |
| Realistic single-table list, detail, add, and edit | [`four-view-crud/README.md`](four-view-crud/README.md) and all descriptors |
| Multi-table operational desk with board, dashboard, related records, workflows, sharing, and agent writeback | [`operations-desk/README.md`](operations-desk/README.md) and all descriptors |
| Effective-dated versions with a materialized current snapshot | [`effective-dated-rules/README.md`](effective-dated-rules/README.md) and all descriptors |
| One compact capture/CRUD surface | [`hello-notes/README.md`](hello-notes/README.md) and all descriptors |

Select the smallest matching pattern. Do not blend unrelated patterns merely to make an app look
more sophisticated. Treat the two complete advanced examples as mutually exclusive starting
points unless the brief independently requires both operational coordination and effective dating.
