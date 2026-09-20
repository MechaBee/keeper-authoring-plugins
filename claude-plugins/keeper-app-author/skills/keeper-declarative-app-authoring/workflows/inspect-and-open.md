# Inspect and Open

Use for discovery, metadata, export, installed validation, or opening an app. Definition authoring
continues in [Author and update](author-and-update.md). No candidate is needed for this workflow.

## Resolve the target

1. Use the single Keeper MCP server bundled with the installed plugin. Complete its OAuth sign-in
   if prompted. Keep the same server and authorization context throughout the task.
2. Read `contract_read` with the relevant topic: `targeting` for discovery, `application` for
   inventory/export, or `launch` for opening. Use `all` when a cross-cutting operation needs it.
3. Call `agent_list`. Match an explicitly requested agent; otherwise select the sole result.
   If several remain plausible, present names and exact IDs for the user to choose.
4. Call `workspace_list` for that agent. Match the requested workspace or use
   `recommendedWorkspaceId`. If neither resolves the target, ask for a choice from the results.
5. Call `app_list` for the selected `agentId` and `workspaceId`; resolve the requested app by its
   returned identity. Do not silently substitute a similarly named app or another workspace.

Reuse the established target during follow-up operations. Recheck discovery if the user changes
the target or the server reports it is no longer accessible. The server pins the domain; do not
ask for or pass one.

## Read only what the request needs

| Request | Tool and scope |
| --- | --- |
| Metadata, access, revisions, inventory | `app_get`; inspect `effectiveAccess` |
| Definition inspection | `app_files_read` with `contentScope: "definitions"` |
| Portable artifact | `app_download`; definition-only by default; media type `application/vnd.mechabee.keeper-app+json` |
| Installed health check | Installed-source `app_validate`; no candidate required |
| URL or browser launch | `app_url_get`; no definition download required |

Use `contentScope: "full"` or `includeData: true` only when the corresponding capability and user
intent permit live-data work; see [Migrate and repair](migrate-and-repair.md). Definition-only
responses do not disclose live-data filenames or revision hashes. Report health-check findings;
edit only if the task also authorizes a fix.

## Open the result

For an installed operational app, call `app_url_get`. Omit `viewId` for the installed `defaultView`,
or pass the exact installed view the user requested. After deployment, use the launch descriptor
provided by [Apply](apply.md).

Return `launch.url` as a clickable **Open deployed app** link. Its identities are the agent,
workspace, app, and view; do not replace an agent ID with a product ID or reconstruct the URL.
When asked to open, preview, show, or test, open the returned URL in the in-app browser when
available and verify the requested view loads. For a URL-only request, return the link.

If the browser reaches MechaBee sign-in, keep the tab open and ask the user to sign in there.
Continue in the same tab after sign-in. MCP authentication does not sign the browser in, and no
credentials or tokens should be transferred between them.

## Failures

For authentication failure, use the bundled server's authentication flow. For access failure,
report the selected target and effective role; do not try another workspace to bypass it. Report
unavailable tools or an unresolved target rather than inventing their results.
