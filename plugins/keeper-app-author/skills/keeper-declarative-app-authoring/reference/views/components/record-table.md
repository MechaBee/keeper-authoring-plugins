# `record_table` Component

Use for dense, repeat-use browsing of a table-shaped source.

```yaml
kind: record_table
title: Tasks
data_source: tasks
columns:
  - field: title
    hideable: false
  - field: status
    label: Stage
    align: center
    empty_text: Unset
  - field: duration_minutes
    label: Time (hrs)
    align: right
    width: narrow
    summary: sum
    duration_presentation:
      storage_unit: minutes
      display_unit: hours
      display_format: hh_mm
search:
  enabled: true
  placeholder: Search tasks
  fields: [title, description]
sort:
  enabled: true
  default: {field: due_date, direction: asc}
density: compact
paging:
  page_size: 50
column_visibility:
  enabled: true
selection:
  state_key: selectedTaskId
  desktop: split
  mobile: page
  persist: false
  reconcile: clear
  reset_state: [selectedSubtaskId]
detail:
  table: tasks
  data_source: selected_task
  title: Task details
  mode: editable
  save_mode: explicit
  fields: [title, status, description]
```

Required: `data_source` and non-empty `columns`. Column entries are a field id or an object with
`field`, optional `label`, `align: left|center|right`, `empty_text`, `wrap`, `width`, `sticky`,
`summary`, `hidden`, `hideable`, and `duration_presentation`. A duration presentation requires `storage_unit: minutes`,
`display_unit: hours`, and `display_format: decimal_hours|hh_mm`; it changes display only, not the
stored value. Optional component
keys are `title`, `show_title`, `description`, `search`, `sort`, `paging`, `column_visibility`,
`density: comfortable|compact`, `selection`, `detail`, `empty_message`, `on_row_click`, and
`export`. Every referenced field must
exist in the resolved schema.

`show_title: false` hides the title text when the view already names what the table shows; controls
such as column visibility, export, and row count remain visible. A column's `empty_text: ""` leaves
empty cells blank instead of showing a dash, and mobile cards omit empty values.

`width: narrow|auto|wide` declares how much room a column asks for. It is display only — `wrap`
still decides whether long values break across lines — and `auto` is the default. Prefer it to
letting a long text column squeeze the columns that identify the row.

`sticky: true` pins a column against horizontal scrolling so a wide table keeps its identifying
column in view. Only the **first** column may be pinned; declaring it elsewhere is an error rather
than a key that quietly does nothing. Desktop table rendering only — the mobile card layout has no
horizontal scroll to pin against.

`summary: sum|avg|count|min|max` renders an aggregate of that column in a summary row beneath the
table (the same operation vocabulary as `aggregate_table` metrics). `sum`, `avg`, `min`, and `max`
require a number field; `count` reports the row count and works on any column. Values format exactly
as the column's cells do, so a `sum` under a `duration_presentation` column reads `22:05`, not
`1325`. A column whose values are all empty summarises to nothing rather than a confident `0`.

Summaries are computed over the rows the table is showing — they track `search` and any view filter,
and they cover the whole filtered set rather than the visible page. They describe **loaded** rows: if
the source has another page waiting, the table says so beneath the summary. When a figure must cover
an unbounded set regardless of what loaded, compute it with an `aggregate_table` source and render it
in a `stats_grid` instead.

```yaml
paging:
  page_size: 50
```

`paging` pages the rows the table already holds; it never fetches another page, and search, sort,
export, and the summary row all keep operating on the whole loaded set. Reach for it on any table
that can return more rows than a reader will scroll — every row is a real DOM node otherwise.

```yaml
column_visibility:
  enabled: true
columns:
  - {field: client_name, sticky: true, hideable: false}
  - {field: member_alias, hidden: true}
```

`column_visibility: {enabled: true}` lets each reader choose which columns their table shows. Two
per-column keys shape what they may choose: `hidden: true` declares a column the table knows about
but does not show until asked for, and `hideable: false` pins a column visible so it never appears
as a toggle. Pair `hideable: false` with `sticky: true` — a pinned column a reader can switch off
loses its pin with it. A `hidden: true` column without `column_visibility` is an error: nothing
could ever reveal it. So is hiding every column, and so is a column that is both `hidden` and
`hideable: false`.

The choice is per-user chrome. It is stored in that reader's own settings — following them across
devices, private to them in a shared workspace, and never touching the app definition — so hiding a
column is not a way to keep data from anyone. Row access is what controls that. A picker offers
*Reset to default*, which restores the author's own arrangement; a column added to the app after a
reader customised the table follows the author's default rather than appearing uninvited.

Hiding a column removes it from the table, the summary row, the mobile cards, and the default search
fields. Export splits: a declared `export.fields` is an explicit contract and is honoured whatever is
on screen, while an export that declares no fields follows the visible columns.

When `detail` is provided, `selection.state_key` is required. Selecting a row opens a table-owned
side pane on desktop and, with `selection.mobile: page`, a full-page detail surface on mobile. The
pane is not rendered until a row is selected and includes a close action that clears selection.
`detail` accepts the complete `record_detail` content syntax except `kind`, including its own
`table` and record-shaped `data_source`. A separate detail source is intentional: a projected table
may remain the browse source while the detail source resolves the selected mutable raw record.
`selection.reconcile: clear` prevents filtered-out or deleted selections from leaving a stale pane.
Set `selection.persist: false` for click-only detail: the selection is omitted from saved view state
and therefore starts closed whenever the user enters or reloads the view.

`export` adds a CSV download:

```yaml
export:
  enabled: true
  label: Export CSV
  filename: entries.csv
  fields: [work_date, project_id, duration_minutes]  # columns to include
  scope: complete        # `page` exports the loaded page; `complete` collects every
                         # policy-visible row up to `max_records`
  max_records: 20000
```

The maximum and default complete-export bound is 20,000 records. Lower explicit bounds remain enforced.

`scope: complete` supports direct `table`, `projected_table`, and `aggregate_table` sources. For a
projected or aggregate source, every underlying table dependency is read completely under the same
`max_records` bound before the server computes the exported rows; exceeding the bound fails instead
of returning a truncated CSV. Pair large direct-table exports with an appropriate compiler-facing
`performance` intent.
