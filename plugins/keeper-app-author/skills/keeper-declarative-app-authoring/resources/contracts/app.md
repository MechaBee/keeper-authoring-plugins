# App And Directory Contract

Every app lives under `keeper/apps/{appId}/`:

```text
app.yaml
schemas/{table}.yaml
views/{viewId}.yaml
workflows/{workflowId}.yaml      # optional
agents/{agentId}.yaml            # optional
data/{table}.jsonl               # optional
```

Keeper discovers an app from `app.yaml`. Required shape:

```yaml
id: project-tracker
title: Project Tracker
version: 1
defaultView: home
schemaVersion: 1
access:
  default_role: none
  users: []
```

Optional keys: `description` and `icon`. `id` must match the app folder and `defaultView` must name
an existing view. The runtime accepts a missing `access` block for legacy apps, but every newly
authored app must materialize `access` with `default_role: none` and `users: []`. Broaden that
baseline only when the approved brief explicitly requires wider membership. Do not list the
workspace owner or a `manage` collaborator solely to preserve their authority; those workspace
modes receive implicit app-admin capabilities.

`access.default_role` is `none`, `viewer`, `editor`, `developer`, or `admin`; `access.users[]` maps
an email to one of those roles.

Use `developer` for definition authors who should retain editor runtime behavior without live JSONL,
role-management, data-replacement, or data-policy authority. Use `admin` only for app membership
and live-data administrators. Existing access-policy changes require admin authority.

All descriptor identifiers use `[A-Za-z0-9_-]+`. View, schema, workflow, and agent filename stems
must match their descriptor ids.
