# Table Schema Contract

Store one schema at `schemas/{table}.yaml`:

```yaml
table: tasks
version: 2
primaryKey: id
idPrefix: task
displayField: title
rowAccess:
  mode: all
fields:
  - id: id
    type: text
    label: ID
    required: true
    readonly: true
  - id: title
    type: text
    label: Title
    required: true
```

Required keys are `table`, `version`, `primaryKey`, `idPrefix`, `displayField`, and non-empty
`fields`. Version 2 also requires `rowAccess`. Optional keys are `referenceLabelTemplate` and
`relations`. `table` must match both the
schema filename stem and any `data/{table}.jsonl` filename. Primary and display fields must exist.
The schema and data path share one exact identifier: `schemas/{table}.yaml` must declare
`table: {table}`.

Use `rowAccess: { mode: all }` for team-wide rows. Use the following elementary owner policy when
members must see and mutate only their own rows:

```yaml
rowAccess:
  mode: owner
  ownerField: owner_user_id
```

The owner field must be an existing required, readonly `text` field and cannot be the primary key.
Keeper stamps it from the authenticated stable user ID. Views and caller filters may narrow row
scope but never widen it. App admins and workspace managers see all rows. Version 1 schemas without
`rowAccess` retain legacy `all` behavior with a validation warning.

Use `referenceLabelTemplate` only when one `displayField` cannot produce a useful reference label.
Read [`fields.md`](fields.md) and [`relations.md`](relations.md) before adding their entries.
