# Relation And Reference Contract

`referenceTable` controls reference input/rendering. A table-level relation controls delete
integrity. Use both for an ordinary foreign key:

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

Keeper can write dangling reference ids. Ensure target rows exist, include a relation unless the
lack of integrity is intentional, and load reference tables in views that edit or display labels.
Do not invent foreign ids without creating the referenced records.
