# `comment_thread` Component

Use when comments are part of an **activity timeline**: one ordinary table holds comments and
events (closed, assigned, labeled, moved), read oldest first as one conversation. The app's own
workflow posts comments, so it can also attach files to them, keep a comment count, and trigger
notifications. [Issue Tracker](../../../examples/issue-tracker/README.md) (`issue_activity` with
`add_comment`) and the [board example](../../../examples/board-example/README.md) (`task_activity`)
are the references.

For discussion that is only comments (threads, replies, resolving, quoted passages), use a
[comment-role table](../../schema/roles.md#comments) with the [`comments`](comments.md) component
instead: Keeper supplies posting, replying, resolving and locking, with no workflows.

```yaml
kind: comment_thread
table: page_comments
data_source: page_comments
thread_field: thread_id
body_field: body
author_field: author_user_id
created_field: created_at
resolved_field: is_resolved
anchor:
  quote_field: anchor_quote
  heading_field: anchor_heading
  document_source: selected_page_file
create:
  data_source: comment_create_action
  label: Comment
empty_message: No comments on this page yet.
```

Required: `table`, a table-shaped `data_source` already filtered to one subject, `thread_field`
and `body_field`. Optional: `title`, `description`, `author_field`, `created_field`,
`resolved_field`, `summary_field`, `anchor`, `create`, `reply`, `reply_to_field`, `resolve`, and
`empty_message`. The open/resolved count
appears only when `resolved_field` is set.

Rows sharing a `thread_field` value form one thread, ordered by `created_field`. The first comment
in a thread owns the anchor. Use `create` with an action-set source — `record_create_action` or `workflow_action` — rather than
building a bespoke composer, so the dialog inherits the action's fields, defaults and permissions.
Prefer `workflow_action` when the author and thread id must be stamped rather than supplied.

Comments are ordinary rows: give the table a `rowAccess` policy and a `mutationPolicy` like any
other, and roles apply as usual. Do not invent a parallel permission model for discussion.

## Replying and resolving

For threaded discussion, give each comment a **Reply** and each thread a **Resolve** / **Reopen**
rather than asking people to type a thread id:

```yaml
kind: comment_thread
table: comments
data_source: review
thread_field: thread_id
body_field: body
author_field: author_user_id
created_field: created_at
resolved_field: is_resolved
reply_to_field: reply_to_comment_id
create:
  data_source: comment_action          # hide reply_to_thread_id and reply_to_comment_id here
reply:
  thread_input: reply_to_thread_id     # receives the thread id
  comment_input: reply_to_comment_id   # optional: receives the answered comment's id
resolve:
  data_source: resolve_action          # a workflow taking the thread id and the new state
  thread_input: thread_id
  state_input: resolved
```

- `reply` opens a composer inside the thread, under a "Replying to <author>" excerpt of the comment
  being answered. It posts through `reply.data_source` (default `create.data_source`) with the
  thread id, and the comment id when `comment_input` is set, preset. The action needs a required
  long-text input and no other required input without a default. Optional `label` and `placeholder`.
- `reply_to_field` names the field holding that comment id. A reply that answers a comment other
  than the one directly above it shows "In reply to <author>: <excerpt>".
- `resolve` requires `resolved_field`. It runs `resolve.data_source` without a dialog, passing the
  thread id and `true` (resolve) or `false` (reopen). The thread's state is read from its first
  comment, so the workflow should find that comment (`query_records` on the thread, oldest first,
  `limit: 1`) and update it. Optional `resolve_label` and `reopen_label`.
- Both controls disappear for viewers who can't run their action. Have the comment workflow check
  that an answered comment belongs to the thread it joins.

## Page-level conversations

Without `anchor` or `resolved_field`, the component reads as one conversation ordered oldest first.
`summary_field` lets the same table carry comments and history events: a row with a body is a
comment; a row with an empty body and summary renders as a compact event line.

```yaml
kind: comment_thread
table: issue_activity
data_source: activity
thread_field: id
body_field: body
summary_field: summary
author_field: actor_user_id
created_field: created_at
create:
  data_source: comment_action
  presentation: inline
  placeholder: Leave a comment. Markdown is supported.
```

`create.presentation: inline` places a composer after the conversation for the action's first
required text input. Other inputs retain their defaults, and **Options** opens the full dialog when
more input is available. It falls back to the default `button` presentation when another required
input lacks a default or the action requires confirmation. Inline creation is invalid with
`anchor`; hide preset record ids with `action_dialog.hidden_inputs`.

## Anchoring

`anchor` records *what a comment was written about* — the quoted text and the heading it sat
under — and resolves it against `document_source` at read time. Do not attempt to store anchors in
the document itself: a markdown body cannot carry inline marks, because serialization drops them
and every save would silently detach every comment.

Resolution is whitespace-insensitive, so ordinary reflowing does not break an anchor. Five outcomes
are reported, and the component renders each honestly:

| Outcome | Meaning |
| --- | --- |
| exact | The quote appears once; the thread points at real text. |
| ambiguous | The quote now appears more than once, so its position is unknown. |
| heading | The quote is gone but its heading survives; the section is still known. |
| detached | Neither quote nor heading survives. |
| none | The comment was never anchored — a page-level thread. |

An anchor is never relocated to whatever text happens to sit nearby. When a body is edited by an
agent — routine in a document app — a stale anchor is expected, and saying so is the correct
behaviour.

Omit `anchor` entirely for page-level discussion; every thread then reports `none` and no
`document_source` is needed.
