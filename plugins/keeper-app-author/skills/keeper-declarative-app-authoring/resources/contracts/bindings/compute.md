# Reactive & initialization values (`compute`)

Editable `record_detail` and `record_form` surfaces may carry a `compute` block: a set of rules
that run a **sandboxed JavaScript** body and write the returned value into one field. Use it to
initialize a field (e.g. today's date) and to keep fields in sync as the user edits (e.g. recompute
a duration from a start/end range, and vice-versa).

```yaml
kind: record_detail
table: time_entries
data_source: selected_entry
mode: editable
sections:
  - id: work
    columns: 2
    fields: [started_at, ended_at, duration_minutes]
compute:
  rules:
    - id: default_work_date            # initialization
      target: work_date
      when: {on: init, if_empty: true}
      script: |
        return context.today;

    - id: duration_from_range          # reactive: range -> duration
      target: duration_minutes
      when: {on: change, of: [started_at, ended_at]}
      script: |
        if (!fields.started_at || !fields.ended_at) return;
        const mins = (new Date(fields.ended_at) - new Date(fields.started_at)) / 60000;
        return Number.isFinite(mins) && mins > 0 ? Math.round(mins) : undefined;

    - id: end_from_duration            # reactive: duration -> range (the reverse)
      target: ended_at
      when: {on: change, of: [duration_minutes, started_at]}
      script: |
        if (!fields.started_at || !fields.duration_minutes) return;
        return new Date(new Date(fields.started_at).getTime() + fields.duration_minutes * 60000)
          .toISOString();
```

## Rule shape

Each rule requires a safe `id` (unique within the block), a `target` field id, a `when` trigger,
and a non-empty `script`. When the surface declares explicit `fields`/`sections`, `target` and every
`when.of` id must be one of them.

- **`when.on`** — `init`, `change`, or an array of both. `init` runs once when the surface loads a
  record; `change` runs on user edits.
- **`when.of`** — source field ids whose user edits fire the rule. **Required (non-empty) whenever
  `on` includes `change`;** ignored for pure `init` rules.
- **`when.if_empty`** — when `true`, the rule writes only if `target` is currently empty
  (null / undefined / `""`). Standard for `init` defaults so opening an existing record never
  overwrites a saved value.

## Script scope

The body is the same execution model as workflow `script` steps and receives:

- `fields` — snapshot of current form values keyed by field id.
- `value` — current value of `target` (alias for `fields[target]`).
- `trigger` — the field id whose edit fired the rule, or `"init"`.
- `context` — `{ nowIso, today, userId, browserTimeZone, locale }`.

Return the new value for `target`; **return `undefined` (or nothing) to leave the field unchanged.**

## Cycle safety

Rules run only on **user-originated** edits (and `init`). A write a rule makes is not itself
user-originated, so derived writes never re-trigger other rules. Mutually-deriving fields are
therefore just two rules pointing at each other, and resolve deterministically as *last field the
user edited wins* — no manual cycle guard needed.

`compute` is a client-side convenience; server validation policies still run on save, so a rule can
never push through a value the schema rejects — it only helps the form produce a consistent one.
