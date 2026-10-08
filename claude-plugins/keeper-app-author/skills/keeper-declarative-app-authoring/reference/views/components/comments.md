# `comments` Component

```yaml
kind: comments
title: Discussion                     # optional
data_source: discussion               # a comments source
placeholder: Start a thread.          # optional
empty_message: No discussion yet.     # optional
```

```yaml
data_sources:
  discussion:
    kind: provider_resource
    provider: workspace
    resource: comments
    params:
      table: opportunity_comments     # a comment-role table
      target_id: {bind: state.opportunity_id}
    refresh_on: [state.opportunity_id]
```

Threads on one record from its [comment table](../../schema/roles.md#comments): post, reply,
resolve and reopen, with authors' names. Nothing to wire: no create action, field mapping or
workflows. Who may comment or resolve, and when commenting is locked, come from the commented
table's `comments:` block; a locked record still shows its threads and lets people resolve them.

On a document, put the `comments` component beside the [`document_page`](document-page.md): new
threads can quote a passage selected in the page, and open ones are highlighted there.

Use [`comment_thread`](comment-thread.md) instead when comments belong in an activity timeline with
other events, or need attachments, a comment count or notifications from the app's own workflow:
role comments show only comments and run no app workflow when posted.
