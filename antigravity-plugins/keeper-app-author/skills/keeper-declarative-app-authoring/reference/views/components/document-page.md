# `document_page` Component

```yaml
kind: document_page
data_source: document                       # a document source
record_views:                               # optional; where "Used by" records open, by table
  opportunities: {view: opportunity, query_param: opportunityId}
empty_message: This document doesn't exist. # optional
```

```yaml
data_sources:
  document:
    kind: provider_resource
    provider: workspace
    resource: document
    params: {document_id: {bind: state.document_id}}
    refresh_on: [state.document_id]
```

One [document](../../schema/roles.md): its title and summary edited in place, status and the
collection's fields in a quiet header, and the body read through the row.

- **Read** renders the Markdown; **Edit** uses the Markdown editor with autosave, conditional on
  the version it started from (a conflict offers reload or keep editing). **Focus** opens a
  full-screen writing view; Esc leaves it.
- With a [`comments`](comments.md) component on the same document in the view, selecting a passage
  offers **Comment**, and open threads' passages are highlighted.
- **Used by** lists records that link the document, link its collection, or own its collection.
- The ⋯ menu offers **Move or rename…** (within or between collections; fields the other
  collection lacks are dropped) and **Delete file…** (the document stays, missing, until deleted or
  re-attached).
- A missing document says so and offers **Attach to a file…** and **Delete**.
- Non-text files show their details only.

Use [`doc_page`](doc-page.md) instead when records have a body field or path of their own and no
collection.
