# View Descriptor Reference

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
Optional top-level keys are `nav`, `share`, `route_state`, `state`, `actions`, `filters`, `access`,
and `exposure`.

`exposure: {mcp: true}` lets connected agents read the view through the Workspace Content tools
`app_view_list` and `app_view_read`, with the reader's own app role and row access. The view's
routed state keys (`route_state`, except `mode: export`) are the parameters an agent passes, so a
record page takes its id and a list takes its filters. The agent gets each data source as data:
table and record sources with a `_labels` map naming their references, comments, linked and
collection documents, a document's text, stats and markdown. Action sets and screen-only sources
are left out, and nothing is changed. Expose the views an agent needs to look things up before or
between [tasks](../automation/task.md): a queue, a list by filter, a record page. A view a role may
not open stays closed to that role's agents.

`view` accepts only `id`, `title`, and optional `description`. Put the entire navigation object at
top level. Both `view.nav` and `view.show_in_nav` are ignored, not alternative syntax. Top-level
`actions` contains `action_set` items, local `date_range_preset` actions, manual `query`
actions, and [`copy_text` buttons](copy-text.md) that show and copy a filled-in text template. An `action_set` may set `placement: inline|overflow`; overflow keeps rare or destructive
actions in the view bar's **More actions** menu. An [AI task](../automation/task.md) action set
without a `placement` joins the view bar's AI control: one task shows as a direct ✨ button, two or
more share one **AI** menu. Set `placement` only to pull a task out of it. A date preset declares
`preset: this_month|this_year`, `from_state_key`, and
`to_state_key`; both keys must exist in top-level `state`. A query action declares a non-empty,
dependent-closed `data_sources` list. Those sources are omitted from initial and automatic
resolution, while shared option/lookup sources outside the list remain eager. Pressing the action
resolves the listed sources once against the current filter state. Top-level `filters` contains `state_select` and
`state_input` items — persistent, state-bound controls rendered above the view. A `state_input`
item has `id`, `label`, `state_key`, `input_type: text|number|date`, optional `placeholder`, and
optional `on_change` actions; `state_select` items follow the
[`state_select` option-source rules](components/toolbar.md). Read those before authoring either
top-level filters or toolbar selectors.

Read the exact component, data-source, layout, navigation, action, and binding references used
by the view. Every component in `layout` must exist, and every user-reachable component must appear
in `layout`.

For top-level role restrictions, see [view access](../security/view-access.md). Share-link policy is documented in [sharing](../security/sharing.md).
