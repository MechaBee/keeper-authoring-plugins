# Schema Field Contract

Every field requires `id`, `type`, and `label`. Supported types are:

`text`, `textarea`, `color`, `number`, `date`, `time`, `datetime`, `select`, `multi_select`,
`boolean`, and `reference`.

Common optional keys are `required`, `readonly`, `default`, `helpText`, `contentFormat`, and
`visible_when`. Numeric fields also accept `min`, `max`, `step`, `unit`, and `currency`.
`contentFormat` is only `plain_text` or `markdown`.

Select options are non-empty strings or exact `{value, label}` objects:

```yaml
options:
  - value: in_progress
    label: In progress
  - value: done
    label: Done
```

Never substitute `id`, `name`, or `title` for `value`. Stored values must match option values.

Reference fields require `referenceTable`. Optional `reference_filters[]` entries contain
`record_field`, `value_field`, and optional `when_empty: none|all`. Optional `reference_where` is a
static equality filter on the referenced table (for example `{archived: false}`) that narrows the
offered options; it is reference-only and combines with any `reference_filters`. Load the referenced
table in a view that must render labels or provide a dropdown.

`referenceTable: keeper_principals` is a runtime-owned principal reference, not an application
schema or JSONL file. For an app-admin form, Keeper supplies a bounded directory typeahead and
returns the selected opaque ID. Ordinary editors receive only contextual options already allowed by
their row policy. Never ask a user to type, derive, or seed a principal ID manually.

`computed.kind` supports only `now`. Computed fields support timestamps only:

```yaml
computed:
  kind: now
  on: create
  format: datetime
```

`on` is `create`, `update`, or `always`; `format` is `iso`, `date`, `time`, or `datetime`.
Computed is always an object; `computed: true` or `computed: false` are invalid. It cannot contain
scripts or derive one field from another. When a date or time is system-owned, model it as a
readonly schema `computed` value and omit it from writable forms and provider defaults.

Coercion highlights: number accepts numeric strings; boolean accepts common true/false strings;
empty select/reference becomes null; `multi_select` becomes a trimmed, deduplicated string array;
time is `HH:MM`; datetime is `YYYY-MM-DDTHH:MM`; color defaults must be hex such as `#10b981`.
