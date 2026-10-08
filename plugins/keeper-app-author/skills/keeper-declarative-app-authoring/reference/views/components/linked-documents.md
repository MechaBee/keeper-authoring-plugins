# `linked_documents` Component

```yaml
kind: linked_documents
title: Documents                                  # optional
data_source: documents                            # a linked_documents source
open: {view: document, query_param: documentId}   # optional
open_collection: {view: library, query_param: collectionId}   # optional
```

```yaml
data_sources:
  documents:
    kind: provider_resource
    provider: workspace
    resource: linked_documents
    params:
      table: opportunities
      record_id: {bind: state.opportunity_id}
      link_table: opportunity_documents          # a document_link table for this record table
      collection_field: collection_id            # optional; the record's own collection
    refresh_on: [state.opportunity_id]
```

One record's documents, placed on its page:

- its own collection (synced) with **New** and **Upload**, or **Start a collection for this
  record** when the record has none;
- its [links](../../schema/roles.md#links) grouped by link role, with their notes and Unlink;
- **Link…**: one picker over collections and documents that asks for the role and why it matters.
