# Operations Desk

Use this example when a brief genuinely needs a lifecycle board, joined dashboard projections,
related-record workspaces, guarded workflows, and an agent writeback in one application. It is an
industry-neutral extraction of those patterns, not a domain template. All organizations, people,
assets, identifiers, and records are fabricated.

Read the complete package before adapting it:

```text
operations-desk/
  app.yaml
  schemas/
  data/
  views/
  workflows/
  agents/
```

The package demonstrates:

- a mutable `record_board` grouped by a writable select field;
- top-level create actions and a deep-linked hidden detail view;
- read-only `projected_table` sources with joins, sentinel-aware filters, and derived values;
- route-backed selection plus related-record tables in asset and plan workspaces;
- row-scoped `create_record` and `update_record` workflow steps with previews and guards;
- a templated-prompt agent that writes a generated markdown summary back to one work order;
- narrowly scoped authenticated sharing of one work-order route.

Keep these safety properties:

- Treat projections as read-only and edit their base tables.
- Keep stable option catalogs separate from mutable business rows.
- Use one-record workflow mutations when the desired result is one-record mutation.
- Do not replace whole tables to update one asset, plan, or work order.
- Require explicit user authorization before adding a bulk replacement step.
- Bind every contextual action to the selected row and validate the entire package with data.
- Replace the example’s domain fields rather than copying irrelevant operational concepts.

Choose a smaller example when possible. Use `four-view-crud/` for one-table CRUD and
`effective-dated-rules/` for successor versions and materialized current snapshots.
