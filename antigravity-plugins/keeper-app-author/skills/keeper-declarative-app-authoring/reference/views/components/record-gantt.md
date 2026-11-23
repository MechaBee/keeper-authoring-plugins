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
    scale: {default: week, options: [day, week, month, quarter, all]}   # optional
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
    milestone_when: {field: is_gate}  # optional; matching rows are diamonds on their end date
                                     # (add equals: <value>, or a list, to match select values)
    progress:                        # optional; fill each bar by its done child records
      data_source: tasks             # a table source of the children
      parent_field: project_id       # the child's reference to the timeline's table
      done_when: {field: status, equals: done}
      skip_when: {field: status, equals: cancelled}   # optional; left out of the count
      label: tasks                   # optional; "3 of 7 tasks done"
    attention_when: {field: status, equals: [at_risk, blocked]}   # optional red outline
    baseline:                        # optional saved plan, drawn under each bar
      start_field: planned_start     # date or datetime
      end_field: planned_due         # date or datetime
    hover:                           # optional card on hover, in place of the plain tooltip
      fields:                        # up to 8, in order; empty values are left out
        - status
        - {field: next_step, label: Next}
      due: {soon_days: 3}            # optional due chip on the end date; also takes done_field
    on_bar_click:
      - type: navigate
        viewId: project
        query: {projectId: {bind: record.id}}
    empty_message: No projects with dates yet.
```

- **Bars.** A record with both dates gets a bar covering both days. Reversed dates are swapped.
  An `end_field` alone gives a milestone; a `start_field` alone gives a bar that fades out at the
  right edge. A datetime value counts by its date. With `milestone_when`, a matching row is a
  diamond on its end date (its start date when it has none) even when it has both dates: use it
  for gates, approvals and submissions that are a moment rather than a stretch of work.
- **Arrows** run from the earlier work to the later work. With `from_field` → `to_field`
  phrased as "A blocks B", no `reverse_kinds` are needed. For a table that also says "B needs A",
  list `needs` in `reverse_kinds`. A link whose other end is filtered out, or has no dates, shows
  as a small link count next to the row's label instead of an arrow.
- **Date clashes.** When the later row starts (a diamond: falls) before the earlier row's last
  day, its arrow is red and dashed, its label gets a calendar warning, and its accessible name,
  tooltip, hover card and phone list say "Starts 4 days before Research finishes"; the key adds
  the red arrow. Starting on the day the earlier one ends is not a clash, and an open bar has no
  finish to clash with. The timeline only flags: moving later rows is a workflow's job.
- **Groups and colours.** `group_by` lists rows under a header per value: a select in its option
  order, anything else by label, rows without a value last. Grouped by the same field as
  `color_by`, each header carries its colour swatch; otherwise, when more than one colour is in
  use, a key under the timeline names them.
- **Progress.** With `progress`, the solid part of a bar is the share of its children matching
  `done_when`, and the rest is paler. Children matching `skip_when` are not counted; a row with
  no counted children keeps a plain bar rather than an empty one. The label's accessible name,
  the tooltip, the hover card and the phone list say "3 of 7 tasks done". Diamonds carry no fill
  and no count. Bound the child source as the view requires: only loaded children are counted.
- **Attention.** With `attention_when`, matching rows keep their `color_by` colour but get a red
  outline and a warning icon by the label, and their accessible name says why ("At risk"). The
  key lists the matched values ("At risk or Blocked").
- **Saved plan.** With `baseline`, a record whose dates moved from its planned dates gets a faint
  dashed bar under its current one (a record still on plan draws none), and the timeline shows a "Saved plan" key. The hover card adds "Planned
  Oct 13 – Oct 16" with the slip ("5 days late", "2 days early"), compared on end dates (start
  dates when an end is missing); the row's accessible name carries the slip too. A plan the row
  still matches is not repeated. Keep the planned fields `workflowOnly` and have the workflows that
  move dates fill them the first time (or a "save as plan" workflow copy the current dates), so
  the plan stays put while the dates move.
- **Hover card.** With `hover`, resting the pointer on a bar or its label, or focusing the
  label with the keyboard, opens a card: the group, the label, the dates and their length, the
  listed fields formatted by type (a select as a badge, a reference with its colour, markdown
  rendered and clamped to a few lines), and the rows linked before and after. `due` adds the same
  chip a table's due column shows ("in 2 days", "3 days overdue"); rows whose `done_field` is set
  get none. List what someone needs at a glance, not the whole record; the row click opens the
  rest. Without `hover`, rows keep a one-line tooltip. Phones show no card.
- **Filtering** belongs to the data sources. Filter both the main source and the dependency
  source as the view requires; row access applies to both.
- **Scale** switches in the component header between `day`, `week`, `month`, `quarter` (a
  label per quarter, "Q1 2027") and `all`, which fits the whole range into the card's width with
  no scrolling; on a crowded axis only the quarter months keep their labels. Without `options`
  all five are offered. The range covers every bar and today's date, padded to whole weeks,
  months or quarters.
- **Undated rows.** With `missing_dates.none: list`, rows without dates are listed under the
  chart as "No dates yet" chips (clickable like a bar) instead of taking an empty row in their
  group; phones list them last under "No dates".
- **Phones** show the same rows as a list grouped by the week each starts, with "After …" for
  arrows.
- A source that returns only its first page says so under the timeline. Bound the main source
  with filters rather than relying on that.

Verification checks that the fields exist (including `hover.fields` and `hover.due.done_field`),
that `milestone_when.field` and `attention_when.field` exist, that the `progress` fields exist
on its source and `parent_field` references the timeline's table
(`VIEW_GANTT_PROGRESS_NOT_REFERENCE`), that `start_field`, `end_field` and the `baseline` fields are date or datetime fields (`VIEW_GANTT_FIELD_NOT_DATE`), and
that `from_field` and `to_field` reference the timeline's table
(`VIEW_GANTT_DEPENDENCY_NOT_REFERENCE`).
