# `action_bar` Component

```yaml
kind: action_bar
title: Actions
data_source: selected_task_actions
empty_message: No actions available.
```

Required: provider source resolving to `action_set`. Optional: `title`, `description`, and
`empty_message`. An `action_bar` is a component, never a data source; do not reference its component
id from top-level `actions`.

Attach quick-fill presets to the generated dialog via `action_dialog.preset_groups` on the
`workflow_action` / `record_create_action` data source — see the Workspace provider catalog.
