# Phone Home Reference

The installed Keeper app (`/k`) opens on a phone home built for someone who logs or checks one
thing and closes the app again. An app tells that home two things in the optional `home` block of
`app.yaml`:

```yaml
home:
  quick_add: {view: my_entries, label: Log time, action: add_entry}
  fact:
    view: my_entries
    source: this_week_entries
    value: sum
    field: duration_minutes
    format: duration_minutes
    template: "{value} this week"
    empty: Nothing logged this week
```

## quick_add

A one-tap chip on the home that opens `view` with an action's form already up.

| Key | Required | Meaning |
| --- | --- | --- |
| `view` | yes | The view that holds the action. |
| `label` | yes | Chip text, 1–32 characters: the task as the reader says it ("Log time"). |
| `action` | no | A `view.actions[].id` of kind `action_set`; its first action opens. Omitted: the view's main action (the first not marked `secondary` or `destructive`). |

Without a declaration the home still learns an app's main action on each phone after its first
use; a declaration makes the chip appear from the first launch and pins its wording.

## fact

One live line under the app in **Continue**, read from one data source of `view`. The source
resolves exactly as it would on that view — default state, the reader's row access — so it never
shows anything the reader could not see there.

| Key | Required | Meaning |
| --- | --- | --- |
| `view` | yes | The view whose source is read. |
| `source` | yes | A `table`, `record`, `projected_table` or `aggregate_table` source of that view. |
| `value` | yes | `count` (rows), `sum` (total of `field`), or `first` (`field` of the first row, or of the record). |
| `field` | for `sum`/`first` | The numeric field to read. |
| `format` | no | `number` (default) or `duration_minutes` (shown as `h:mm`). |
| `template` | no | One line with `{value}`, at most 60 characters. Default `{value}`. |
| `empty` | no | Shown instead when the value is zero or missing. Without it the row keeps its usual "opened 2h ago" line. |

A source that exists only for the fact still loads with its view, so keep it small: filter to the
reader and a short window. `context.weekStartLocal` and `context.monthStartLocal` (see
[binding values](../views/bindings/values.md)) express "this week" and "this month":

```yaml
this_week_entries:
  kind: table
  table: time_entries
  filter: {owner_user_id: {bind: context.userId}}
  where:
    all:
      - {field: work_date, op: gte, value: {bind: context.weekStartLocal}}
      - {field: work_date, op: lte, value: {bind: context.todayLocal}}
  limit: 200
```

Choose a fact the reader acts on — hours still to log, issues waiting — not a vanity total. Verification
rejects a `home` block whose view, action or source does not exist.
