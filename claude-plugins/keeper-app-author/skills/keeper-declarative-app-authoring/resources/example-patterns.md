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
| Small DynamoDB-backed CRUD surface | [`dynamodb-notes/README.md`](dynamodb-notes/README.md) and all descriptors |

The selection principles for this table — smallest matching pattern, no blending, and the two
advanced examples as mutually exclusive anchors — live in
[`design/README.md`](design/README.md). Decide the archetype there, then read every descriptor of
the one example you pick.
