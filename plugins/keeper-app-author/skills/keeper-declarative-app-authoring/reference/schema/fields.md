# Schema Field Reference

Every field requires `id`, `type`, and `label`. Supported types are:

`text`, `textarea`, `color`, `number`, `date`, `time`, `datetime`, `select`, `multi_select`,
`boolean`, and `reference`.

Common optional keys are `required`, `readonly`, `default`, `helpText`, `contentFormat`, and
`visible_when`. Numeric fields also accept `min`, `max`, `step`, `unit`, and `currency`.
`contentFormat` is only `plain_text` or `markdown`.

A field marked `workflowOnly: true` is written only by workflow steps: it is excluded from direct
create/update forms and provider defaults and is rejected on direct writes, so workflow logic owns
its value. It cannot be combined with `readonly` or `computed`. Use it for references a workflow
stamps — for example a parent `timesheet_id` or accounting `period_id`.

`input` optionally controls form presentation. Its `placeholder` is a non-empty string. A semantic
`time` field may set `input.variant: flexible_text` to render a text box instead of the time picker.
The runtime accepts an hour (`9`, `09`), compact time (`930`, `0930`), or colon time (`9:30`,
`09:30`), normalizes it to `HH:MM`, and validates it again on the server.

A `select` or `reference` field may set `input.variant: search` to render a filterable picker —
a search box over the option labels — instead of the plain dropdown. Leave the variant unset and
the field decides for itself: it renders the plain dropdown while it is short and promotes itself
to the searchable picker once it exceeds 15 options, so growing reference tables stay usable
without an edit. Set `search` to get the picker below that threshold, or `default` to keep the
plain dropdown above it. Under this variant `input.placeholder` is the search box's placeholder.
Options are matched by label, not by stored id.

Select options are non-empty strings or exact `{value, label}` objects:

```yaml
options:
  - value: in_progress
    label: In progress
  - value: done
    label: Done
```

Never substitute `id`, `name`, or `title` for `value`. Stored values must match option values.

Reference fields may set `multiple: true` to hold an array of referenced row ids. Use this for a
team-maintained vocabulary such as labels, tags, or skills. A multi-value reference cannot have a
default or participate in a query path, unique constraint, or row-policy scalar. When it has a
relation, that relation must use `onDelete: block`. Filter it with `includes` / `not_includes`. Every stored id
must resolve to a row the writer may read.

```yaml
- {id: labels, type: reference, label: Labels, referenceTable: labels, multiple: true}
```

Reference fields require `referenceTable`. Optional `reference_filters[]` entries contain
`record_field`, `value_field`, and optional `when_empty: none|all`. Optional `reference_where` is a
static equality filter on the referenced table (for example `{archived: false}`) that narrows the
offered options; it is reference-only and combines with any `reference_filters`. Load the referenced
table in a view that must render labels or provide a dropdown.

`referenceTable: keeper_principals` is a runtime-owned principal reference, not an application
schema or JSONL file. For an app-admin form, Keeper supplies a bounded directory typeahead and
returns the selected opaque ID. Ordinary editors receive only contextual options already allowed by
their row policy. Never ask a user to type, derive, or seed a principal ID manually.

Use `referenceTable: keeper_app_members` when the value must be an active member of the current
app, such as an assignee, project grant, or group member. It is a runtime-owned app-scoped table and
needs no schema or JSONL file. Historical references remain valid after membership is removed.

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
empty select/reference becomes null; `multi_select` and multi-value reference become a trimmed,
deduplicated string array;
time is `HH:MM`; datetime is `YYYY-MM-DDTHH:MM`; color defaults must be hex such as `#10b981`.
