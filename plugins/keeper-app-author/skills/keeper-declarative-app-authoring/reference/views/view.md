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
collection documents, a document's text, stats and markdown; screen-only sources are left out, and
reading changes nothing. Expose the views an agent needs to look things up before or between
[tasks](../automation/task.md): a queue, a list by filter, a record page. A view a role may not open
stays closed to that role's agents.

The view also lists its `actions` for the agent, and `app_action_run` runs one as the person's own
click would, with their role, row access and mutation policy: the view's action-set buttons
(workflows, record create and update, document and collection actions), its comment box (new
thread, reply, edit own comment, resolve), editing an `editable` `record_detail` and adding a row
with a `record_form`. A disabled button is listed with its reason. Agents never delete: delete
actions, unlinks and workflows with a `delete_record` or `replace_records` step are listed as
unavailable. AI task and team hand-over actions are left out; agents use procedures for those.

### Views agents work in

A [team given a record](../automation/task.md#give-a-record-to-a-team) works through the shared
views, so design those views for an agent as well as a person:

- **A record page per table people hand over.** Keeper finds the record through a shared view
  whose routed parameter opens that table's record (a `record` source bound to the routed state
  key). A record shown only as a selected row inside another page has none: add a small record
  page (it can stay out of `nav`) with the record, what it belongs to and its discussion.
- **The actions it needs are on that page.** Status changes, the comment box, an editable detail
  for fields it may set, and the form or button that adds a related row (a source, a task).
- **Say what an action is for.** An action's label and description are all the agent sees; a
  workflow's `title` fills in when the button has no description.
- **Where to report.** Agents post where people read: a thread on the record, or a channel the job
  description names. Prefer the app's own comment box to a report-only workflow.

An agent receives every data source by default, helpers included: a lookup, the full rows behind a
`projected_table`. List the ones it should get in `exposure.sources` to keep the rest on screen only,
for example a lean list for agents that projects wide records down to a few columns:

```yaml
exposure: {mcp: true, sources: [tasks]}   # task_records (whole rows) stays a screen-only helper
```

`view` accepts only `id`, `title`, and optional `description`. Put the entire navigation object at
top level. Both `view.nav` and `view.show_in_nav` are ignored, not alternative syntax. Top-level
`actions` contains `action_set` items, local `date_range_preset` actions, manual `query`
actions, and [`copy_text` buttons](copy-text.md) that show and copy a filled-in text template. An `action_set` may set `placement: inline|overflow`; overflow keeps rare or destructive
actions in the view bar's **More actions** menu. [AI task](../automation/task.md) actions and
`copy_text` agent prompts (`agent: true`) go to the **AI menu**: one ✨ icon in the app bar's fixed
right corner, beside the notifications bell, that lists every AI action on the page. Set
`placement: inline` only to pin one to the view bar; `overflow` sends AI actions to the AI menu too. A date preset declares
`preset: this_month|this_year`, `from_state_key`, and
`to_state_key`; both keys must exist in top-level `state`. A query action declares a non-empty,
dependent-closed `data_sources` list. Those sources are omitted from initial and automatic
resolution, while shared option/lookup sources outside the list remain eager. Pressing the action
resolves the listed sources once against the current filter state. Top-level `filters` contains `state_select` and
`state_input` items — persistent, state-bound controls rendered above the view. A `state_input`
item has `id`, `label`, `state_key`, `input_type: text|number|date`, optional `placeholder`, and
optional `on_change` actions; `state_select` items follow the
[`state_select` option-source rules](components/toolbar.md). Read those before authoring either
top-level filters or toolbar selectors. A `period` item picks the period a
[report](components/report.md#2-ask-with-an-aggregate-source) covers.

On desktop the View Bar keeps text search, the period control and two more filters in sight; when
at least two more would follow, they fold behind one `Filters` button, and the ones that are set
show as removable chips. Mark the filters people change most with `primary: true` (on a
`state_select` or `state_input`) to keep those in the bar instead of the first two. Order filters
by how often they change, and leave `primary` off when the first two are the right ones. Phones
fold every filter but search behind `Filters` once there are more than two.

Read the exact component, data-source, layout, navigation, action, and binding references used
by the view. Every component in `layout` must exist, and every user-reachable component must appear
in `layout`.

For top-level role restrictions, see [view access](../security/view-access.md). Share-link policy is documented in [sharing](../security/sharing.md).
