# Relation And Reference Reference

`referenceTable` controls reference input/rendering. A table-level relation controls delete
integrity. Use both for an ordinary app-owned foreign key:

```yaml
fields:
  - id: project_id
    type: reference
    label: Project
    referenceTable: projects

relations:
  - field: project_id
    references:
      table: projects
      field: id
    onDelete: block
```

`onDelete` is `block` or `cascade`; omitted means block. Cascade succeeds only when the requested
delete mode is cascade and every inbound relation traversed also permits cascade.

A relation on a multi-value reference (`multiple: true`) validates every id in the list. It must use
`onDelete: block`; cascading from one entry would delete a record merely because that record shared
one of several references.

Keeper can write dangling reference ids. Ensure target rows exist, include a relation unless the
lack of integrity is intentional, and load reference tables in views that edit or display labels.
Do not invent foreign ids without creating the referenced records.

Platform-owned `keeper_app_members` and `keeper_principals` are exceptions: use `referenceTable`
without a table-level relation. App delete relations cannot target them, and membership removal
must not cascade into application data. Never create replacement schemas for these names. For
new member assignments, use a server-side workflow lookup as described in
[membership](../security/membership.md) and [optional lookups](../automation/steps.md).
