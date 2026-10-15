# `record_gantt` Component

A timeline: one row per record of a table source, with a bar from its start date to its end date
on a day axis. Optional arrows show which records come before which. The component is read-only:
change dates in a detail view or a workflow.

```yaml
components:
  timeline:
    kind: record_gantt
    title: Timeline
    data_source: projects            # a table (or projected_table) source
    label_field: name
    sublabel_field: domain_id        # optional second line under the label
    start_field: start_date          # date or datetime
    end_field: due_date              # date or datetime
    bar_label_field: next_step       # optional text inside the bar when it fits
    color_by: {field: domain_id}     # optional; a reference's own colour field, else a stable palette
    group_by: {field: domain_id, empty_group: {label: No domain}}   # optional
    scale: {default: week, options: [day, week, month]}             # optional
    today_marker: true               # default true
    missing_dates:                   # what a record with one date, or none, becomes
      only_end: milestone            # milestone (default) | hide
      only_start: open_bar           # open_bar (default) | hide
      none: hide                     # hide (default) | list
    dependencies:                    # optional arrows
      data_source: links             # a table source with one row per link
      from_field: from_project_id    # reference to the timeline's table
      to_field: to_project_id        # reference to the timeline's table
      kind_field: kind               # optional
      reverse_kinds: [needs]         # kinds drawn from `to` to `from`
    on_bar_click:
      - type: navigate
        viewId: project
        query: {projectId: {bind: record.id}}
    empty_message: No projects with dates yet.
```

- **Bars.** A record with both dates gets a bar covering both days. Reversed dates are swapped.
  An `end_field` alone gives a milestone; a `start_field` alone gives a bar that fades out at the
  right edge. A datetime value counts by its date.
- **Arrows** run from the earlier work to the later work. With `from_field` → `to_field`
  phrased as "A blocks B", no `reverse_kinds` are needed. For a table that also says "B needs A",
  list `needs` in `reverse_kinds`. A link whose other end is filtered out, or has no dates, shows
  as a small link count next to the row's label instead of an arrow.
- **Filtering** belongs to the data sources. Filter both the main source and the dependency
  source as the view requires; row access applies to both.
- **Scale** switches between days, weeks and months in the component header. The range covers
  every bar and today's date, padded to whole weeks or months.
- **Phones** show the same rows as a list grouped by the week each starts, with "After …" for
  arrows.
- A source that returns only its first page says so under the timeline. Bound the main source
  with filters rather than relying on that.

Verification checks that the fields exist, that `start_field` and `end_field` are date or
datetime fields (`VIEW_GANTT_FIELD_NOT_DATE`), and that `from_field` and `to_field` reference the
timeline's table (`VIEW_GANTT_DEPENDENCY_NOT_REFERENCE`).
