# `toolbar` Component

Use for controls local to a component group:

```yaml
kind: toolbar
title: Lead actions
items:
  - id: edit
    kind: link
    label: Edit
    viewId: edit-lead
    appearance: secondary
    query:
      leadId: {bind: state.selectedLeadId}
presentation:
  variant: compact
  mobile: menu
```

Required: non-empty `items`. Item kinds are:

- `action_set`: safe `id`, provider action-set `data_source`.
- `state_select`: `id`, `label`, `state_key`, `options_source`, `value_field`, `label_field`,
  optional `placeholder` and `on_change` actions.
- `link`: `id`, `label`, existing `viewId`, optional bound `query`, and
  `appearance: default|secondary`.

`state_select` renders one option per row from `options_source`; it does not deduplicate values or
read a select field's schema options. Use a dedicated, stable option table containing exactly one
row per allowed value and a user-facing label. Do not point `options_source` at the mutable entity
table being filtered. Ensure the option catalog covers every schema select value, including values
with no current entity rows.

Optional toolbar keys: `title`, `description`, `empty_message`, and `presentation` with
`variant: default|compact` and `mobile: wrap|menu`. Use top-level view `actions`/`filters` for
framework-level controls. Use links only for contextual or hidden destinations; ordinary visible
peer navigation belongs to the global view switcher.
