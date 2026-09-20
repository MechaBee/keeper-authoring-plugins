# `timesheet_week_grid` Component

An incubating matrix editor for weekly time capture: rows are project/task/billable identities,
columns are the days of one period, and each cell aggregates a value field. It is a domain adapter
over a table-shaped source — it owns no persistence, authorization, workflow, or schema semantics.

```yaml
kind: timesheet_week_grid
title: Weekly overview
table: time_entries
data_source: week_entries          # table-shaped entries for the selected period
period:
  data_source: selected_timesheet  # record source resolving the active period
  start_field: week_start
  column_field: work_date
  column_count: 7
  entry_context_field: timesheet_id   # resolved at create time; never an editable input
period_navigation:
  data_source: my_timesheets
  selection_state_key: selected_timesheet_id
  create_data_source: create_timesheet_action
  empty_message: No weekly sheets overlap this month.
rows:
  identity_fields: [project_id, task_id, billable]
  primary_label_field: project_id
  secondary_label_field: task_id
  metadata_fields: [billable]
cells:
  value_field: duration_minutes
  detail_fields: [description]
  empty_behavior: delete_record        # or clear_value
  multi_record_behavior: aggregate_drilldown   # or warning
  duration_presentation:
    storage_unit: minutes
    display_unit: hours
    input_formats: [decimal_hours, hh_mm]
    minute_increment: 15
selection:
  column_state_key: selected_work_date
  identity_state_keys:
    project_id: selected_project_id
    task_id: selected_task_id
    billable: selected_billable
  record_state_key: selected_entry_id
editing:
  create_data_source: grid_entry_action   # workflow_action that inserts one entry
  save_mode: autosave                      # or explicit
totals:
  target: 2400
  show_row_totals: true
  show_column_totals: true
empty_message: Add a project or task row to begin this week.
```

Required: `table`, `data_source`, `period`, `rows`, `cells`, and `editing`. Optional: `title`,
`description`, `period_navigation`, `selection`, `totals`, and `empty_message`.

- **period** — `data_source` (record source for the active period), `start_field`, `column_field`,
  optional `column_count` (default 7), and optional `entry_context_field` (a period key the runtime
  resolves at entry-create time and passes to the action; it is never rendered as an editable
  input).
- **period_navigation** — optional browsing chrome: `data_source`, `selection_state_key`, optional
  `status_field`, `notices`, `create_data_source`, `actions_data_source`, and `empty_message`. The
  selected record is still resolved through `period.data_source`.
- **rows** — `identity_fields` (the fields that define one row), `primary_label_field`, optional
  `secondary_label_field`, and optional `metadata_fields`.
- **cells** — `value_field` (the summed numeric field), optional `detail_fields`, `empty_behavior`
  (`delete_record` | `clear_value`), and `multi_record_behavior` (`warning` keeps one record per
  cell; `aggregate_drilldown` sums multi-record cells read-only until an individual record is
  selected through a companion list/detail). Optional `duration_presentation` renders a minute-stored
  value as hours: `storage_unit: minutes`, `display_unit: hours`, `input_formats` (`decimal_hours`,
  `hh_mm`), and `minute_increment`.
- **selection** — `column_state_key`, `identity_state_keys` (map every row identity field to a
  view-state key), optional `record_state_key` (set for a single-record cell, cleared for empty or
  multi-record cells), and optional `reset_state`.
- **editing** — `create_data_source` (a `workspace` `workflow_action` that inserts one entry),
  optional `save_mode` (`explicit` | `autosave`), and optional `enabled_when`
  (`{data_source, field, values}`) gating whether the grid accepts edits.
- **totals** — optional `target`, `show_row_totals`, and `show_column_totals`.

Because a cell writes through `editing.create_data_source`, keep that workflow row-scoped and let it
own validation; the grid never bypasses workflow or row-policy checks.
