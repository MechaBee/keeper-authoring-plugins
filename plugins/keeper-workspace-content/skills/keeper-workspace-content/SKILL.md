---
name: keeper-workspace-content
description: Browse, read, and author Markdown or other UTF-8 files in MechaBee workspaces, and prepare exact-path asset transfers. Use for workspace content tasks; use the Keeper app-authoring plugin for declarative app definitions and data administration.
---

Use the Workspace Content MCP for the user's selected MechaBee content task.

1. Discover available agents with `agent_list`, then call `workspace_list` for the selected agent. Reuse the user's existing selection when it is still available. Domain and identity are supplied by the server.
2. Start at `/` for an owned workspace or a returned root grant. For a subtree share, start at its exact `pathPrefix`. Never infer root access from the workspace's overall mode. List each relevant minimal scope shallowly and follow `nextCursor`, including after an empty filtered page.
3. Read text with `content_read` before editing. Preserve Markdown frontmatter, style, and unrelated content. Send its `currentVersionId` as `baseVersionId` to `content_write`. A conflict requires rereading and merging the intended change; do not blindly retry or discard another writer's edits.
4. For a new artifact, choose an agreed descriptive path. Use a slug plus timestamp or run ID when collisions would be harmful: creation is upsert, not atomic create-only. A write grant can modify files in existing directories; missing-parent creation may require manage access.
5. For large or binary assets, obtain `content_download` or `content_upload_prepare` for the exact selected path. Use the harness's HTTP/file tools to GET or PUT, following the returned method and required headers. Upload can overwrite without version checks; prefer a unique destination when overwrite is unintended. Verify text with `content_read`, or binary content with `content_list`/`content_download` after upload.

Transfer URLs and headers are secret bearer capabilities. Do not print, persist, or paste them into authored content, reports, or logs. Use only for the requested transfer and within the reported expiry. If the harness cannot perform the transfer without exposing the capability, explain the limitation rather than inventing a completed transfer.

A forbidden or revoked scope is a stopping condition for that path. Do not retry against root, enumerate siblings, or bypass the Keeper raw-file guard. Historical versions may be unavailable on LFS; reread/merge remains the conflict recovery workflow. Use `contract_read` when a focused contract detail is needed.
