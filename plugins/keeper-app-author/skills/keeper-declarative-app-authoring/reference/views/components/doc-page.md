# `doc_page` Component

Use for a page whose properties are a record and whose body is a workspace markdown file:

```yaml
kind: doc_page
table: pages
data_source: selected_page
body_source: selected_page_file
header:
  title_field: title
  meta_fields: [updated_at]
properties: [space_id, status, owner_user_id]
body:
  mode: editable
  save_mode: autosave
  show_path: true
  open_in_workspace_editor: {enabled: true, label: Open editor}
```

Required: `table`, a record-shaped `data_source`, and a `body_source` resolving to
`workspace_file`. Optional: `title`, `description`, `actions_source`, `mode: editable|read_only`,
`header`, `properties`, `body`, `empty_message`, and `actions`.

`header` takes `title_field` and `meta_fields`; `properties` is a record-detail field list rendered
as one quiet line. Both read the record. `body` accepts `mode`, `save_mode: explicit|autosave`
(default `autosave`), `show_path`, `placeholder`, `save_label`, and `open_in_workspace_editor`.

Bind the body path through the record so one selection drives both halves:

```yaml
data_sources:
  selected_page:
    kind: record
    table: pages
    id: {bind: state.selectedPageId}
  selected_page_file:
    kind: provider_resource
    provider: workspace
    resource: file
    params:
      path: {bind: source.selected_page.record.body_path}
    depends_on: [selected_page]
```

The body is an ordinary workspace file, not a record field. Keep it under `docs/{appId}/…` and
never under `keeper/`: paths inside `keeper/apps/{appId}/` are app definition or app data, which
places them behind raw-access visibility and inside upload diffs. The runtime refuses a document
write that resolves outside its own app's document folder, that is not `.md`, or that contains a
hidden segment.

Autosave writes the body against the version it was read at. A refused write — normally another
person or an agent having written the file first — stops autosave and offers the writer a reload or
a chance to keep editing. Never present a refused save as a success, and never resubmit against a
refreshed base version: that discards the other writer silently.

Row policy governs the record, not the file. Anyone with workspace `write` can read and change
every body under `docs/`, whatever the app roles say. Do not use `doc_page` for content that needs
per-page confidentiality; keep that in a record field with an owner or resource-grant policy.
