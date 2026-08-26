# View Descriptor Contract

One file at `views/{viewId}.yaml` defines one composable screen:

```yaml
view:
  id: home
  title: Home
  description: Optional user-facing description
nav:
  order: 10
state: {}
data_sources:
  records:
    kind: table
    table: records
components:
  records_table:
    kind: record_table
    data_source: records
    columns: [title]
layout:
  component: records_table
```

Required top-level keys are `view`, non-empty `data_sources`, non-empty `components`, and `layout`.
Optional top-level keys are `nav`, `share`, `route_state`, `state`, `actions`, and `filters`.

`view` accepts only `id`, `title`, and optional `description`. Put the entire navigation object at
top level. Both `view.nav` and `view.show_in_nav` are ignored, not alternative syntax. Top-level
`actions` contains only `action_set` toolbar items. Top-level `filters` contains `state_select` and
`state_input` items — persistent, state-bound controls rendered above the view. A `state_input`
item has `id`, `label`, `state_key`, `input_type: text|number|date`, optional `placeholder`, and
optional `on_change` actions; `state_select` items follow the
[`state_select` option-source rules](../components/toolbar.md). Read those before authoring either
top-level filters or toolbar selectors.

Read the exact component, data-source, layout, navigation, action, and binding contracts referenced
by the view. Every component in `layout` must exist, and every user-reachable component must appear
in `layout`.
