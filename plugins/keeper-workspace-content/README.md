# Keeper Workspace Content

Keeper Workspace Content connects your coding agent to the files in your MechaBee workspaces, and exposed Keeper app tasks. Find and revise documents, or let an agent prepare an app task,
read its scoped context and submit validated results without leaving the conversation.

## What you can do

- Browse the workspaces and shared folders you have access to
- Read Markdown and other UTF-8 text, and write it back with a version check
- Perform app-defined tasks using logical records and associated documents
- Submit results through existing Keeper workflows, with app UI review when requested
- Inspect a file's version history
- Move large or binary assets in and out using short-lived, single-path transfer capabilities

## Safe by default

Every edit to existing text carries the version the text was read at, so a concurrent edit produces a conflict
instead of silently overwriting someone else's work. Recovery is reread-and-merge, never a blind
retry. Transfer capabilities are secret bearer URLs scoped to one exact path with a short expiry;
the plugin is instructed never to print, persist, or paste them into authored content.

A forbidden or revoked scope stops that path. The plugin does not retry against the workspace root,
enumerate siblings, or work around the Keeper raw-file guard.

## Authentication and data handling

The plugin signs in through MechaBee OAuth and requests separate read and write scopes. Never paste
access tokens, passwords, or MFA codes into a prompt. Every operation is limited to the agents,
workspaces, and paths available to the authenticated user.

See the [MechaBee privacy policy](https://mechabee.com/privacy) and
[terms of service](https://mechabee.com/terms).

## Related

For declarative Keeper app definitions and data administration, use the
[Keeper App Author](https://mechabee.com/keeper) plugin instead.

## Get help

Email [info@mechabee.com](mailto:info@mechabee.com).

## App task limits

App authors opt in with `exposure: {mcp: true}` on an existing task descriptor. Tasks support record
outputs, new Markdown run files, and documents created or revised in an app's document collections,
with `on_result` or `on_approval`. The connected agent performs the reasoning; Keeper does not
launch a managed worker or require its inference billing account.

Collection documents are returned in the submitted result and written by Keeper on save; a revision
is accepted only if the document is unchanged since the agent read it. Run-file paths include the
run ID and use standard workspace upserts, without atomic create-only writes. Keeper issues receipts for verified document versions. Source checks use observed content
and existing workflow concurrency protocols; files and records are separate operations.
Uncommitted drafts remain after cancellation, rejection or expiry. Unknown write or commit outcomes
are never automatically retried. Approval happens in the app's existing task run card.
