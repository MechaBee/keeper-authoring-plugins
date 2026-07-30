# `record_board` Component

Use for collaborative work that should stay in a select-backed lifecycle board. A board can be a
simple navigational Kanban, or it can own selection, quick creation, saved rank, embedded editable
detail, checklist/activity/link records, completion lifecycle, and movement history.

```yaml
kind: record_board
title: Delivery board
table: tasks
data_source: tasks
group_by:
  field: status
card:
  title_field: title
  body_field: details
  badge_field: priority
  meta_fields: [project_id]
  signals:
    - {field: assignee_id, kind: avatar, label: Owner}
    - {field: due_date, kind: date, label: Due}
    - {field: progress, kind: progress, label: Progress, max: 100}
    - {field: labels, kind: labels}
groups:
  - {value: queued, label: Queued}
  - {value: active, label: Active, color: "#0ea5e9", limit: 8}
  - {value: done, label: Done, color: "#10b981", done: true}
search:
  enabled: true
  placeholder: Search work
  fields: [title, details, assignee_id, labels]
filters:
  - {field: priority}
  - {field: assignee_id, label: Owner}
create:
  data_source: task_create_action
  label: Add card
  title_field: title
ordering:
  field: position
  step: 1000
archiving:
  field: archived
completion:
  field: completed_at
activity:
  data_source: task_activity_create
  record_field: task_id
  body_field: body
  type_field: type
  from_field: from_status
  to_field: to_status
checklist_progress:
  field: progress
  mode_field: progress_mode
  checklist_section: checklist
  data_source: task_checklist_rollup
  record_field: task_id
selection:
  state_key: selectedTaskId
  mobile: page
detail:
  mode: editable
  save_mode: autosave
  detail_view: task-detail
  header:
    title_field: {field: title, mode: edit}
    meta_fields:
      - {field: status, mode: edit}
      - {field: assignee_id, mode: edit}
  fields: [details]
  related_sections:
    - id: checklist
      kind: checklist
      table: task_checklist_items
      data_source: task_checklist_items
      title_field: title
      completed_field: completed
      create:
        data_source: task_checklist_create
        fields: [title]
    - id: activity
      kind: activity
      table: task_activity
      data_source: task_activity
      body_field: body
      author_field: author
      occurred_at_field: created_at
      type_field: type
      create:
        data_source: task_activity_create
        label: Comment
        fields:
          - {field: body, multiline: true}
    - id: links
      kind: links
      table: task_links
      data_source: task_links
      title_field: title
      url_field: url
      create:
        data_source: task_link_create
        fields: [title, url]
allow_group_change: true
```

Required: `table`, a table-shaped `data_source`, and `group_by.field`. The grouping field must be a
select field. `card` accepts the legacy title/body/badge/meta fields plus `signals[]`. Signal kinds
are `text`, `badge`, `date`, `avatar`, `progress`, `count`, and `labels`; progress accepts `max`.

`groups[]` entries require `value` and may set `label`, `description`, hex `color`, positive
`limit`, `done`, or `hidden`. WIP counts use all active cards rather than only search results.
Limits are visually highlighted, not hard-blocked.

Content and workflow options:

- `filters[]` contains `{ field, label? }`; select, multi-select, reference, and boolean fields give
  the best facet experience.
- `create.data_source` resolves to an action set. Inline column creation supplies the title,
  grouping value, and ending rank to the first enabled action.
- `ordering` persists numeric rank and enables exact drag/drop plus keyboard/touch menu moves.
- `selection.state_key` is required when `detail` is used. On desktop the selected record opens in
  a board-owned side pane; on mobile it becomes a full-page detail surface.
- `detail` accepts the `record_detail` content contract, excluding `kind`, `table`, and
  `data_source`. `detail_view` remains available as an explicit deep link.
- `related_sections[]` reads table sources filtered by the selection state. `create.data_source`
  should preset the relation field from that same state key. Checklist sections can toggle
  `completed_field`; activity sections combine comments and movement events; links sections open
  `url_field` externally.
- `checklist_progress` connects a numeric parent field to a checklist section. Its `data_source`
  must be an unfiltered source for the checklist table so every card can show completed/total
  counts; `record_field` links those rows to board records. Automatic mode derives and locks the
  percentage, an empty checklist falls back to manual editing, and `mode_field` stores an explicit
  manual override. `automatic_value` and `manual_value` default to `automatic` and `manual`;
  missing mode values remain manual so upgrades preserve existing percentages.
- `completion.field` is a date/datetime field. Entering a `done` group stamps it; leaving clears it
  unless `clear_when_reopened: false`.
- `activity.data_source` resolves to a create action set. Successful cross-column moves write the
  configured record/body/type/from/to fields after the card update.
- `archiving` hides archived cards by default and provides archive/restore card actions.

Set `allow_group_change: true` only for an editable table source whose grouping field is writable.
Projected sources cannot use group changes, create, ordering, archiving, completion, activity,
checklist progress, detail actions, related creation, or editable detail. Search and facet
filtering intentionally disable exact drag ordering until the constrained view is cleared;
accessible menu moves remain available.

For a complete, data-free app that composes these capabilities, read every file listed by the
[`board-example`](../../board-example/README.md).
