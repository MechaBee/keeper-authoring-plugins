# Keeper Workspace Content

Keeper Workspace Content connects your coding agent to the files in your MechaBee workspaces, so
you can find a document, read it, and revise it in place without leaving the conversation.

## What you can do

- Browse the workspaces and shared folders you have access to
- Read Markdown and other UTF-8 text, and write it back with a version check
- Inspect a file's version history
- Move large or binary assets in and out using short-lived, single-path transfer capabilities

## Safe by default

Every write carries the version the text was read at, so a concurrent edit produces a conflict
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
