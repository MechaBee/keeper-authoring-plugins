# `report` Component

Draws one `aggregate` source as a pivot table with totals, one tile per measure, or a chart (bars,
line, ranking) of the same cells. The figures are computed on the server over every row the viewer
may read, and only the grouped cells reach the page, so a report covers a year of entries without
loading them. Use it for summaries people read: hours per member and project this month, billable
share by client, a trend by week.

A report has three parts: the table declares what may be reported on (`reporting`), the view's
`aggregate` source asks one question, and the `report` component draws the answer.

## 1. Declare `reporting` on the table

```yaml
# schemas/time_entries.yaml
reporting:
  dimensions:
    - {id: date, field: work_date, label: Date, buckets: [week, month, year]}
    - {id: member, field: owner_user_id, label: Member, all_values: true}
    - {id: project, field: project_id, label: Project}
    - {id: client, field: project_id.client_id, label: Client}   # one reference hop
    - {id: billable, field: billable, label: Billable,
       value_labels: {"true": Billable, "false": Non-billable}}
  measures:
    - {id: hours, label: Hours, op: sum, field: duration_minutes, format: duration_hours}
    - {id: billable_hours, op: sum, field: duration_minutes, where: {billable: true}, format: duration_hours}
    - {id: billable_share, label: Billable share, ratio: [billable_hours, hours], format: percent}
    - {id: members, op: count_distinct, field: owner_user_id}
    - {id: entries, op: count}
```

Dimension and measure ids share one namespace and must be unique.

- **Dimensions** group and filter. `field` is a select, boolean, single-value reference, short text,
  date or datetime field, or one hop through a single-value reference (`project_id.client_id`).
  A date dimension must list its `buckets` (`day`, `week`, `month`, `quarter`, `year`); no other
  dimension takes buckets. Optional: `label`; `all_values: true` (references, selects, booleans)
  also returns values with no rows, such as a member who logged nothing; `value_labels` (booleans,
  selects); `values: {table, key, label, where}` (references) labels keys from another table, such
  as a member's alias in a profiles table, where `where` narrows only the `all_values` list; `who`
  lists the app roles that may group or filter by the dimension (default anyone who can open the
  report).
- **Measures** are `op: sum` (a number `field`), `count` (no `field`), or `count_distinct` (any
  `field`), with an optional `where` of single field values that a row must match to count. A
  `ratio: [numerator, denominator]` names two other, non-ratio measures and takes no `op`,
  `field` or `where`. `format` is `number` (default), `duration_hours` (reads minutes, shows hours)
  or `percent`.

## 2. Ask with an `aggregate` source

```yaml
# views/summary.yaml
state:
  period: null
  project: null
filters:
  - {id: period, kind: period, label: Period, state_key: period, units: [month, quarter, year], default: this_month}
data_sources:
  hours_by_member:
    kind: aggregate
    table: time_entries
    period: {dimension: date, bind: state.period}
    filter: {project: {bind: state.project}}   # an empty binding means no filter
    rows: [member]
    columns: [{dimension: date, bucket: auto}]
    measures: [hours]
    totals: true
    compare: previous_period
```

Required: `table` (a table with `reporting`) and non-empty `measures`. Optional:

- `rows`: up to three dimensions, outermost first. `columns`: at most one. A date dimension on an
  axis needs a bucket, `{dimension: date, bucket: month}`, from its declared `buckets`, or `auto`:
  days for a month, weeks for a quarter, months for a year. A dimension appears once per source.
- `period: {dimension, bind: state.<key>|route.<key>}` limits a date dimension to a period value
  (`2026-08`, `2026-Q3`, `2026`); empty means all time. Bind it to a `period` filter (below).
- `filter`: dimension id to a value or binding. Filter dates with `period`, not `filter`.
- `compare: previous_period` also computes every cell over the preceding period of the same length;
  it needs `period`.
- `totals: true`: subtotals per row level, per column, and a grand total.
- `sort: {measure, direction: asc|desc}` (one of the source's measures) and `limit` (top N) order
  the outermost row dimension; both need `rows`. Default order is the dimension's.
- `refresh_on`, as on other sources.

Aggregates are complete or fail; they are never partial.

**The period filter.** A top-level `filters` item `{id, kind: period, state_key, label?, units?,
default?}` gives back and forward buttons and a unit switch, and writes `2026-08`, `2026-Q3` or
`2026` to `state_key`. `units` is any of `month`, `quarter`, `year` (default all three);
`default` is `this_month`, `this_quarter`, `this_year`, or `none` for all time.

## 3. Draw it with `report`

```yaml
components:
  hours:
    kind: report
    title: Hours by member
    data_source: hours_by_member
    show_as: table
    on_cell_click:
      - type: navigate
        viewId: entries
        query:
          member: {bind: record.member}
          from: {bind: record.period_from}
          to: {bind: record.period_to}
```

Required: `data_source` (an `aggregate` source) and `show_as`. The source's shape must fit:

| `show_as` | Source shape |
| --- | --- |
| `table` | At least one row dimension; a pivot with the column dimension across. |
| `number` | No rows or columns; one tile per measure. |
| `bars` | One row dimension (the bars), at most one column (the series). `stack: true` stacks the series. |
| `line` | One date row with a bucket (the time axis), at most one column (the series). |
| `ranking` | One row dimension and no columns. |

Optional: `title`, `description`, `empty_message` (default "Nothing recorded in this period."),
`stack` (`bars` only), `export`, and `on_cell_click`.

- With `compare`, each figure shows its change against the previous period, which the report names.
- `show_as: table` offers a CSV of what it shows, named after the title and period; set
  `export: false` to hide it.
- `on_cell_click` runs [component actions](../actions/index.md) on a cell with a value. The
  action's `record` holds the cell's keys by dimension id (`record.member`), plus `period_from` and
  `period_to`: the report's period, narrowed to the clicked date bucket. Use them to open the rows
  behind a figure. Grand-total cells are not clickable.
- A report is read-only and shows no rows; for row lists use a [record table](record-table.md)
  with an `aggregate_table` source or column `summary`.
