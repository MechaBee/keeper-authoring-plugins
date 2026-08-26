# Keeper App Author

Keeper App Author connects Claude Code to MechaBee Keeper so you can create and maintain operational
apps from a conversation. Describe the records, views, workflows, and access model you need; the
plugin turns that brief into a complete declarative app package and validates it against the live
Keeper contract.

Install and support documentation: <https://mechabee.com/keeper/app-author>

## What you can build

- Boards, lists, tables, dashboards, and record workspaces
- Schemas, relationships, seed data, and row-scoped access policies
- Workflows, provider actions, and agent-assisted operations
- New apps or carefully scoped changes to existing apps

## A safer deployment workflow

Keeper App Author discovers the exact agent and workspace before it acts. It validates complete
candidates, previews a diff, and stages the change for review before applying it. Existing app
edits preserve live JSONL records by default. Data replacement requires both the necessary app
authority and explicit user intent.

## Authentication and data handling

The plugin signs in through MechaBee OAuth and requests separate read and write scopes. Never paste
access tokens, passwords, or MFA codes into a prompt. Keeper limits every operation to the agents,
workspaces, apps, and data available to the authenticated user.

See the [MechaBee privacy policy](https://mechabee.com/privacy) and
[terms of service](https://mechabee.com/terms).

## Get help

Visit [Keeper App Author support](https://mechabee.com/keeper/app-author#support) or email
[info@mechabee.com](mailto:info@mechabee.com).
