# Hello Notes Example App

This is a complete, deliberately small Keeper app. It demonstrates the file
topology and cross-file links of a single-table CRUD app:

```text
hello-notes/
  app.yaml
  schemas/notes.yaml
  views/home.yaml
```

It contains no data, workflows, agents, project documents, or domain-specific
assumptions. Syntax references remain authoritative. First read the applicable syntax
references and the assigned brief. Use this example only when a new app needs an
end-to-end baseline, then read only the descriptor files that clarify the scope.

Adapt every id, table, field, label, and view to the target app. Do not copy the
app wholesale. `record_collection` is appropriate here because Notes is small,
self-contained CRUD. It is not a default for an operational queue, complex
record workspace, dashboard, or automation scope.

The view demonstrates the capture-genre defaults from
[record collection](../../reference/views/components/record-collection.md): instant create with optional fields, an autosaving
detail with an always-on title and markdown editor, a grid-first browse with the
detail in a desktop overlay, archiving with an include-archived toggle, and a
`route_state`-synced selection so notes are deep-linkable and the browser back
button closes the detail. Back-office apps should instead keep the explicit-save
defaults shown in [app foundation](../patterns/app-foundation.md).
