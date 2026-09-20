# Table Schema Reference

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
`fields`. Version 2 also requires `rowAccess`. Optional keys are `referenceLabelTemplate`,
`relations`, `mutationPolicy`, `validationPolicy`, `constraints`, and `queryPaths`. `table` must match both the
schema filename stem and any `data/{table}.jsonl` filename. Primary and display fields must exist.
The schema and data path share one exact identifier: `schemas/{table}.yaml` must declare
`table: {table}`.

Use `referenceLabelTemplate` when the display field alone cannot provide a useful reference label.
Read only the relevant extensions:

- [Fields](fields.md) and [relations](relations.md).
- [Row access](../security/row-access.md): required for version 2.
- [Mutation restrictions](../security/mutations.md): roles, channels, lifecycle.
- [Validation policy](validation.md) and [aggregate constraints](constraints.md).
- [Logical query paths](../storage/query-paths.md).
