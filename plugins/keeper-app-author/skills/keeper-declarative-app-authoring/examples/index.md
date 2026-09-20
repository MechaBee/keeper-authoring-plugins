# Composition Examples

Examples show how valid pieces fit together. Use one when it resolves a composition question;
there is no requirement to use an example for every task or to keep its screen count. Read the
selected syntax references before depending on unfamiliar properties.

| Need | Example |
| --- | --- |
| Flagship: time entry, weekly grid, reports, setup and access | [Time Tracker](time-tracker/README.md) |
| Full issue workflow, enriched member profiles, project grants, tabs and grouped navigation | [Issue Tracker](issue-tracker/README.md) |
| Small capture/list/edit app | [Hello notes](hello-notes/README.md) |
| Collaborative board features | [Board](board-example/README.md) |
| Board, dashboard, related records, workflows, sharing and agent | [Operations desk](operations-desk/README.md) |
| Successor versions and a materialized current snapshot | [Effective-dated rules](effective-dated-rules/README.md) |
| Minimal DynamoDB CRUD | [DynamoDB notes](dynamodb-notes/README.md) |

Start with the Time Tracker reading guide for a task-oriented business app. Use Issue Tracker when
the design needs several related work views, app-specific member metadata, resource grants, an
activity timeline, or a larger administration area. Both route to individual patterns; neither
whole app is required reading for an unrelated task.

For a whole-app starting point, inspect its full descriptor set and retain the dependencies needed
by the adapted app. For maintenance or one interaction, inspect only the relevant descriptors and
their dependencies. Do not copy unrelated fields, sample people, or optional board features into
the user's app. Preserve runtime-owned keys, reserved binding roots, and action envelopes while
adapting the domain and topology.

Some retained examples intentionally contain legacy version-1 schemas. For a new team app, use
version 2 with explicit [row access](../reference/security/row-access.md). Do not copy implicit
legacy `all` access without making the requested visibility decision. Examples with status
workflows may also need an end-user guide when adapted for real users.

## Smaller recipes

- [App foundation](patterns/app-foundation.md)
- [Board](patterns/operational-board.md)
- [Record workspace](patterns/record-workspace.md)
- [Read-only dashboard](patterns/dashboard.md)
- [Workflow and agent](patterns/automation.md)

Recipes are snippets, not complete candidates. Add the required schemas, actions, and destinations
or omit the feature that references them. Validate the complete adapted app through the normal
authoring workflow.
