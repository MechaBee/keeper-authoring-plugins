# App And Directory Reference

Every app lives under `keeper/apps/{appId}/`:

```text
app.yaml
notifications.yaml              # optional live notification rules and copy
schemas/{table}.yaml
views/{viewId}.yaml
workflows/{workflowId}.yaml      # optional
agents/{agentId}.yaml            # optional
docs/{document}.md               # optional end-user guide
ai/{guide}.md                    # optional AI task guides (read by the AI, never shown to users)
data/{table}.jsonl               # optional
```

Keeper discovers an app from `app.yaml`. Required shape:

```yaml
id: project-tracker
title: Project Tracker
version: 1
defaultView: home
schemaVersion: 2
```

Optional keys: `description`, `icon`, `status` (`active` or `archived`), `storage`, and `docs`. `id`
must match the app folder and `defaultView` must name an existing view. `access` is not a valid manifest
key. Keeper stores app membership as mutable control-plane state outside the portable definition,
so adding or removing a user does not change the app revision or trigger deployment work.

Use `schemaVersion: 2` for new app manifests. Existing version-1 apps remain supported; do not
upgrade them incidentally during an unrelated edit. Each table schema separately declares its
`version`; version 2 requires explicit `rowAccess`.

All descriptor identifiers use `[A-Za-z0-9_-]+`. View, schema, workflow, and agent filename stems
must match their descriptor ids.

## Commit notifications

`notifications.yaml` is an optional app-root file for commit event rules, recipients, and
event-specific inbox and push copy. It is live app content outside the deployed definition
revision. See [commit notifications](notifications.md) for its complete syntax and delivery
behavior. `app.yaml` must not contain a `notifications` key.

Storage intent is described in [storage](../storage/index.md). Optional end-user guide syntax is in [user-guide.md](user-guide.md). App roles and row policies are explained in [app security](../security/index.md).
