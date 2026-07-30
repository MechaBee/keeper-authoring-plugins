# Keeper MCP Authoring Workflow

Use this workflow for every Keeper task performed through the plugin.

## Connection and authentication

The server uses Codex's MCP OAuth flow. When authentication is required, use the Codex
Authenticate action and sign in through the MechaBee Cognito page. Codex dynamically registers as
a public PKCE client with the MechaBee OAuth broker; the broker exchanges tokens with the
environment's dedicated confidential Cognito client. Do not create, copy, or configure access-token
environment variables.

Use the single Keeper MCP server bundled by the installed plugin for the entire task. Do not
substitute another Keeper server mid-task because app revisions, OAuth credentials, and staged
upload IDs belong to one environment.

## Target discovery

1. Call `contract_read` with `topic: "all"`.
2. Call `agent_list`. Select the only returned agent automatically; if several are returned,
   present their names and exact `agentId` values and ask the user to choose.
3. Call `workspace_list` with the selected `agentId`.
4. Use `recommendedWorkspaceId` when present. The server recommends the visible `default`
   workspace first, or the sole visible workspace. If no recommendation is returned, present the
   workspaces and ask the user to choose.
5. Call `app_list` with the exact `agentId` and `workspaceId`.
6. For an existing app, call `app_get`, inspect `effectiveAccess`, then call `app_files_read` with
   `contentScope: "definitions"`.

The server pins the environment's domain and does not accept a domain argument. Keep the selected
`agentId`, `workspaceId`, and `appId` unchanged in every subsequent call. If more than one plausible
target exists, stop and ask the user.

## Read and download

- Use `app_get` for parsed metadata, effective access, scoped revision, and permitted inventory.
- Use `app_files_read` with `contentScope: "definitions"` for normal authoring. Definition-only
  responses do not disclose live-data filenames or revision hashes.
- Use `app_download` when the user requests a portable
  `application/vnd.mechabee.keeper-app+json` artifact. It is definition-only by default.
- Use installed-source `app_validate` for a health check that does not require an edit.
- Request `contentScope: "full"` or installed validation with `includeData: true` only when
  `effectiveAccess` grants raw-data access and the user explicitly intends live-data work.

## Candidate construction

Represent a candidate as an array of complete files:

```json
[
  {
    "path": "app.yaml",
    "content": "..."
  },
  {
    "path": "schemas/tasks.yaml",
    "content": "..."
  }
]
```

Allowed paths are:

```text
app.yaml
schemas/<id>.yaml
views/<id>.yaml
workflows/<id>.yaml
agents/<id>.yaml
data/<id>.jsonl
```

Do not include absolute paths, traversal, duplicate paths, unsupported directories, or binary
content.

For every new app, include this explicit baseline in `app.yaml`:

```yaml
access:
  default_role: none
  users: []
```

Broaden it only from approved app-membership requirements. Do not guess user identities or list
workspace owners/managers merely to preserve their implicit app-admin authority.

### Data intent and authority

Existing applications might include existing user data in `data/*.jsonl` that you must handle with
care according to user intent, effective app authority, and instructions. Establish whether the
requested change is initial creation, definition-only refactoring, or an explicit live-data
replacement before constructing the candidate.

For a definition-only update:

- Use `dataMode: "preserve"` and omit every JSONL file. The server combines submitted definitions
  with installed data for validation and apply.
- Never request or carry forward live JSONL merely to keep it unchanged.
- A `developer` can perform this flow but cannot read live data, change app roles, weaken an
  existing `rowAccess` policy, or add an unrestricted table. Use the schemas and synthetic/empty
  mock rows if example records are needed for reasoning.
- Confirm `app_diff` reports no JSONL path as modified or deleted.

For a new app, definitions and requested seed JSONL may be created in one candidate. Seeds are
optional; do not introduce a mock/seed-data subsystem when empty initial tables satisfy the brief.

For an existing app's data edit, migration, or full redesign, require app-admin raw-data authority
and explicit user intent. Read with `contentScope: "full"`, inspect affected rows and schema,
describe the expected impact, and use `dataMode: "replace"` with upload `mode: "replace"`. Apply
only after the user authorizes the reviewed live-data change.

## Validation and review

1. Call candidate-source `app_validate`; set `includeData: true` when the candidate has JSONL.
2. Repair errors and validate again.
3. Call `app_diff`:
   - existing definition work: `dataMode: "preserve"`; JSONL is omitted and retained server-side
   - `replace`: submitted definitions are the complete definition state; omitted definitions are
     deletions
   - `merge`: submitted definitions overlay installed definitions; omissions are retained
   - authorized live-data work: `dataMode: "replace"` plus `mode: "replace"`
4. Review `added`, `modified`, `deleted`, `unchanged`, and `unknownInstalledPaths`.

Validation and diff are read-only. Prefer them while iterating.

## Two-phase upload

Call `app_upload_prepare` only when the user requested a workspace change. Preparation validates
and stages the candidate but does not alter the installed app.

Retain:

- `uploadId`
- `baseRevision`
- `candidateRevision`
- `expiresAt`
- the exact `modified` and `deleted` path lists

Before apply, present the material diff to the user. Call `app_upload_apply` only when the user
authorized applying that reviewed stage. Set:

```text
expectedRevision = baseRevision
acknowledgedDestructivePaths = sorted(modified + deleted)
```

Added files do not require destructive acknowledgement. If apply reports a stale revision,
discard the old plan, reread the app, rebuild the candidate, and prepare again. Never substitute
the current revision into an old upload. Definition-only stages pin only the definition revision,
so concurrent record activity does not make them stale. Data-replacement stages pin the complete
revision.

The server stores only the submitted overlay in the stage. It signs the stage and binds it to the
authenticated user and exact OAuth authorization credential. Never edit a staged file, reuse an
upload from another authorization, or copy a stage between workspaces.

Call `app_upload_abort` for an unused stage. It removes only the stage, not the installed app.

## Open, preview, or test an app

Use the `launch` descriptor returned by a successful `app_upload_apply`, or call `app_url_get` for
an already installed app. Omit `viewId` to open the manifest's `defaultView`, or pass an exact
installed view requested by the user.

When the user's intent includes opening, previewing, showing, or testing the app:

1. Open `launch.url` in the in-app browser when it is available.
2. Show the resulting page to the user.
3. If the browser is redirected to MechaBee sign-in, keep that tab open and ask the user to
   complete sign-in there.
4. Do not attempt to enter, request, or infer the user's credentials.
5. Continue in the same tab after sign-in and verify that the requested Keeper view loads.

When the user asks only for the URL, return the clickable link without opening a browser.

MechaBee web sign-in and Keeper MCP authentication are separate authentication contexts. An
authenticated MCP connection does not imply an authenticated browser session. Do not transfer an
MCP token into the browser or put a token in the launch URL.

## Failure handling

- Authentication failure: re-authenticate the bundled MCP server and verify that its OAuth
  resource and scopes match its endpoint; do not weaken server enforcement.
- Access failure: report the selected workspace and app role without trying another workspace.
- Validation failure: follow diagnostics and focused bundled contracts.
- Ambiguous target: ask the user.
- Stale upload: prepare a fresh stage.
- Apply failure: report the server result; do not assume partial changes succeeded.
