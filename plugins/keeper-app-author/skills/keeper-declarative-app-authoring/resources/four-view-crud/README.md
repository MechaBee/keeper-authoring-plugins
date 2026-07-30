# Request Register: Four-view CRUD

This is the canonical topology for a focused single-entity app whose brief requires four separate
screens: a filterable list, read-only detail, add, and edit. The example is deliberately concrete:
it tracks operational requests with ownership, lifecycle, priority, due dates, and decision notes.
Adapt this before reaching for a dashboard or workflow-heavy application.

The descriptor shapes pass the Keeper verifier. The one intentional advisory is the list's
queryless link to the hidden Add view: the descriptor-local warning cannot see that the destination
is hidden. Contracts remain authoritative.

```text
four-view-crud/
  app.yaml
  schemas/requests.yaml
  schemas/status_options.yaml
  schemas/priority_options.yaml
  data/status_options.jsonl
  data/priority_options.jsonl
  views/request_list.yaml
  views/request_detail.yaml
  views/request_add.yaml
  views/request_edit.yaml
```

Read every listed file before adapting this example. The JSONL rows are option catalogs, not sample
entity data. Preserve the topology and binding shapes, but replace domain-owned app, table, field,
view, component, state, route, and label identifiers with the brief's domain. Binding roots are not
domain-owned: preserve reserved `record`, `state`, `route`, `source`, `context`, and `action` roots
exactly. A projected `path:` alias declared by `from.as` is separate and may be adapted consistently.
Do not copy an irrelevant request field or invent a fifth screen.

Cross-check these invariants before reporting completion:

- `app.yaml.defaultView` names `request_list`.
- Every view filename matches `view.id`, and the schema filename matches `table`.
- Detail, Add, and Edit are hidden with top-level `nav.visible: false`; never use the unsupported
  `view.nav` or `view.show_in_nav` shapes.
- Select options use `{ value, label }`, never `{ id, label }`.
- Every `state_select.options_source` is a dedicated option catalog with one row per schema value;
  it never points at mutable entity rows.
- The list links to the hidden Add view and passes `record.id` to Detail on row click.
- Add passes the created row to Detail with the same reserved `record.id` binding. Never substitute
  an entity root such as `lead.id` or `task.id` in a `bind` value.
- Detail passes its route-bound record id to Edit.
- Add uses `record_form`; Edit uses an editable, record-backed `record_detail`.
- Read-only and editable detail headers do not duplicate fields in their sections.
- Navigation lives in documented component action arrays or contextual/hidden-destination toolbar
  links, never view-level navigation entries. Use the framework view switcher for ordinary jumps
  back to visible peer views; do not add queryless Back/Cancel toolbar links for those destinations.
- Every view has a non-empty `data_sources` map, including Add.
- Schema `computed` is timestamp-only (`kind: now`); it cannot run scripts or synthesize a display
  field from other fields.

This example is not a lifecycle board, dashboard, multi-table workspace, workflow, or agent pattern.
Use `operations-desk/` when those capabilities are essential, or `effective-dated-rules/` for
versioned policy data and successor workflows.
