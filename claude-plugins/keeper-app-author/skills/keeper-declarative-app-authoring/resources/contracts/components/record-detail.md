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
- `field_schema` for a validated inline display/edit schema.
- primitive/bound `value` for a derived display value.
- `when.visible`, `when.editable`, and `when.required` dialog conditions.
- `ui`: `label`, `show_label`, `help_text`, `placeholder`, `empty_text`, `copyable`,
  `width: full|half|third`, `chrome: default|subtle|plain`,
  `edit_flow: always|click_to_edit`, and a supported `variant`.

Variants are `text`, `textarea`, `markdown`, `title`, `subtitle`, `badge`, `checkbox`, `select`,
`multi_select`, `date`, `datetime`, `reference_chip`, `reference_link`, and
`workspace_file_link`. The last requires `ui.workspace_file.detail_view`, optional
`path_query_param`, and optional `preserve_route_keys`.

Sections require safe `id` and non-empty fields; optional `title`, `description`, positive
`columns`, and `visible_when`. Header accepts `title_field` and `meta_fields`. Do not duplicate the
same field in header and sections.

`presentation: document` renders a borderless title + body surface for the capture genre: it
suppresses the component-title eyebrow and collapses header `meta_fields` into a single quiet footer
line under the body. The default `form` renders labeled sections. Pair `document` with a
`record_collection` so pin/color/archive/delete come from the derived affordance bar instead of
detail fields.

`actions_source` names provider sources that resolve to action sets. Inline `actions[]` requires
`id`, `label`, a documented provider action, and optional `confirm` and
`appearance: default|secondary|destructive`. `detail_view` generates a conventional deep link;
prefer explicit navigation when route naming must be controlled. A projected table cannot directly
back `record_detail`.
