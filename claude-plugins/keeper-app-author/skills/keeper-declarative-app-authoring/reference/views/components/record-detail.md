# `record_detail` Component

Use a record-shaped source to view or edit one row:

```yaml
kind: record_detail
table: tasks
data_source: selected_task
mode: editable
save_mode: explicit
show_primary_key: false
header:
  title_field: title
  meta_fields: [status, updated_at]
sections:
  - id: overview
    title: Overview
    columns: 2
    fields:
      - field: title
        mode: edit
        ui: {width: full, edit_flow: click_to_edit}
      - field: description
        ui: {variant: markdown, width: full}
actions:
  - id: delete_task
    label: Delete task
    appearance: destructive
    confirm: "Delete this task?"
    action:
      type: provider_action
      provider: workspace
      action: delete_record
      params:
        table: tasks
        recordId:
          bind: record.id
        mode: block
```

Required: `table` and record-shaped `data_source`. Optional: `title`, `description`,
`actions_source`, `mode: editable|read_only`, `save_mode: explicit|autosave`, `show_primary_key`,
`density: comfortable|compact`, `presentation: form|document`, `empty_message`, `save_label`,
`detail_view`, and `actions`.

Use either `fields` or `sections`. A field is a field id or object with `field` and optional:

- `mode: edit|display|hidden`, `contentFormat: plain_text|markdown`.
- `field_schema` for a validated inline display/edit schema. It accepts `type`, `label`, `options`,
  `referenceTable`, `reference_filters`, `helpText`, `contentFormat`, `min`, `max`, and `step`.
- primitive/bound `value` for a derived display value.
- `when.visible`, `when.editable`, and `when.required` dialog conditions.
- `ui`: `label`, `show_label`, `help_text`, `placeholder`, `empty_text`, `copyable`,
  `width: full|half|third`, `chrome: default|subtle|plain`,
  `edit_flow: always|click_to_edit`, a supported `variant`, and `input`.
- `ui.input`: `{variant: default|flexible_text|search, placeholder, date_field}`. `flexible_text`
  on a `date`/`time`/`datetime` field swaps the native picker for a free-text box ("9", "930",
  "09:30"); on a `datetime` field it edits the time portion and preserves the stored date.
  `search` on a `select`/`reference` field swaps the dropdown for a filterable picker; leaving
  the variant unset promotes the field to that picker on its own past 15 options.
- `ui.input.date_field` (only with `flexible_text` on a `datetime` field) names a `date` field on
  the same table that owns the day. A typed time is composed onto that field's current value, and
  editing that date in the form moves the time with it. Without it, a datetime with no stored value
  takes today's date, which breaks any rule that requires the time to fall on the record's own
  date. Set it whenever the record has a date field of its own:
  `{field: started_at, mode: edit, ui: {input: {variant: flexible_text, date_field: work_date}}}`.

Variants are `text`, `textarea`, `markdown`, `title`, `subtitle`, `badge`, `checkbox`, `select`,
`multi_select`, `date`, `datetime`, `reference_chip`, `reference_link`, and
`workspace_file_link`. The last requires `ui.workspace_file.detail_view`, optional
`path_query_param`, and optional `preserve_route_keys`.

`reference_link` on a reference field uses
`ui.reference_link: {detail_view, query_param, preserve_route_keys}` to open the referenced record's
page. `query_param` defaults to `id`. The field may still use `edit_flow: click_to_edit`: the link
navigates, while the rest of the field enters editing.

```yaml
- field: parent_issue_id
  mode: edit
  ui:
    variant: reference_link
    reference_link: {detail_view: issue, query_param: issueId}
    edit_flow: click_to_edit
```

A `reference_chip` pointing to `keeper_principals` or `keeper_app_members` shows the person's name;
email is a tooltip only when the current viewer may receive it. A multi-value reference
(`multiple: true`) displays as colored chips and edits as toggle chips over the referenced rows; it
needs no special variant.

Sections require safe `id` and non-empty fields; optional `title`, `description`, positive
`columns`, and `visible_when`. Header accepts `title_field` and `meta_fields`. Do not duplicate the
same field in header and sections.

Section `columns` respond to the width of the detail component, not the browser window. A detail in
a narrow split pane remains one column until that pane has enough room. `density: compact` pairs
fields from roughly 16rem of available content width, so a compact detail with `columns: 2` can
place short values side by side; give long values `ui.width: full`.

`presentation: document` renders a borderless title + body surface for the capture genre: it
suppresses the component-title eyebrow and collapses header `meta_fields` into a single quiet footer
line under the body. The default `form` renders labeled sections. Pair `document` with a
`record_collection` so pin/color/archive/delete come from the derived affordance bar instead of
detail fields.

An editable surface may carry a `compute` block for reactive/initialization field values (e.g.
default a date to today, or keep a duration in sync with a start/end range). See
[bindings/compute.md](../bindings/compute.md).

`actions_source` names provider sources that resolve to action sets. Inline `actions[]` requires
`id`, `label`, a documented provider action, and optional `confirm` and
`appearance: default|secondary|destructive`. `detail_view` generates a conventional deep link;
prefer explicit navigation when route naming must be controlled. A projected table cannot directly
back `record_detail`.
