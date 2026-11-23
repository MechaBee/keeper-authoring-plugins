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
  optional `placeholder`, `clearable`, `clear_label`, `variant`, and `on_change` actions.
- `link`: `id`, `label`, existing `viewId`, optional bound `query`, optional `description`, and
  `appearance: default|secondary`.

`state_select` renders one option per row from `options_source`; it does not deduplicate values or
read a select field's schema options. Use a dedicated, stable option table containing exactly one
row per allowed value and a user-facing label. Do not point `options_source` at the mutable entity
table being filtered. Ensure the option catalog covers every schema select value, including values
with no current entity rows. Set `clearable: true` to prepend a synthetic option that writes `null`
to `state_key`; use `clear_label` for text such as `All projects`. Clearing also runs `on_change`
with no selected record, so use constant follow-up values rather than `record.*` bindings there.

Past 15 options a `state_select` becomes a searchable picker (typing narrows the list by label),
the same rule select and reference fields follow. Set `variant: search` to get the search box on a
shorter list, or `variant: default` to keep the plain dropdown on a long one. No other value is
accepted.

Optional toolbar keys: `title`, `description`, `empty_message`, and `presentation` with
`variant: default|compact|cards` and `mobile: wrap|menu`. Use top-level view `actions`/`filters` for
framework-level controls. Use links only for contextual or hidden destinations; ordinary visible
peer navigation belongs to the global view switcher.

## Flow cards

`presentation: {variant: cards}` turns the toolbar into the content of a work-with page: a card per
item, listing the jobs people come to the app to do and where to go next.

```yaml
flows:
  kind: toolbar
  title: What do you want to do?
  description: Each flow walks you through it. Nothing is saved until the last step.
  presentation: {variant: cards}
  items:
    - {id: add, kind: action_set, data_source: add_scenario_action}
    - {id: delegate, kind: link, label: Delegate to the Tester, viewId: delegate}
    - {id: scenarios, kind: link, label: Browse scenarios, viewId: scenarios,
       description: Every scenario with its latest result.}
```

- An `action_set` item shows a card per action: its label, its `description` param, the steps of a
  [step-by-step dialog](../providers/workspace.md#step-by-step-dialogs-action_dialoglayout-steps)
  with Review, and the team it hands the record to, with the cost limit. An unavailable action stays
  on the page, greyed, with its reason.
- A `link` to a [flow page](flow.md) shows the same card for that page's flow, so the flow is
  declared once. Any other `link` is a card with its `description` and an arrow.
- Items are action sets and links only; a `state_select` is an error. `mobile` is an error: the
  cards stack on a phone.
