# `collection_view` Component

```yaml
kind: collection_view
data_source: documents                       # a collection_documents source
open: {view: document, query_param: documentId}   # optional; where a document opens
empty_message: Choose a collection.          # optional
```

```yaml
data_sources:
  documents:
    kind: provider_resource
    provider: workspace
    resource: collection_documents
    params: {collection_id: {bind: state.collection_id}}
    refresh_on: [state.collection_id]
```

One collection's documents. Loading the source [syncs](../../schema/roles.md#collections-and-documents)
the collection with its folder, so files written by agents and other tools appear.

- Columns: the document, the collection's own fields, status (with the `review_status` feature) and
  updated (when the document table has `updated_at`). Files in subfolders show their folder.
- Editors get **New document**, **Upload** and drop for `.md`, `.markdown` and `.txt`, **Edit
  collection**, and Archive or Restore per row; archived documents sit behind a toggle.
- A missing document (its file renamed or deleted) shows in place with **Attach to a file…** and
  **Delete**; the delete confirmation says how many comments and links go with it.
- Files not yet recorded (over the sync bound) are counted in a notice and appear on a later load.
