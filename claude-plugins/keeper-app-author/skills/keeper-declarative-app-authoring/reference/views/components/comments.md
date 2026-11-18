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

## Thread actions

`thread_actions` puts a button on each thread, such as **Ask AI** or **Summarise**. Each entry
names an action-set source (a `workflow_action` or an `agent_task_action`) and the input that
receives the thread's id. Hide that input with the source's `action_dialog.hidden_inputs` and give
it an empty preset: a hidden required input needs a preset, and the button replaces it with the
thread's id when clicked.

```yaml
components:
  discussion:
    kind: comments
    data_source: discussion
    thread_actions:
      - {data_source: ask_ai, thread_input: thread_id}            # open threads only (default)
      - {data_source: summarise, thread_input: thread_id, show_on: all}
data_sources:
  ask_ai:
    kind: provider_resource
    provider: workspace
    resource: agent_task_action
    params: {task_id: answer_thread, label: Ask AI, input__thread_id: ""}
    action_dialog: {hidden_inputs: [thread_id]}
```

- `show_on: open` (default) shows the button on unresolved threads; `all` on resolved ones too.
- A button opens its action as anywhere else: an AI task shows what it will read and asks before it
  starts. The person needs the right to run the action, and the button is hidden when they can't.
- At most four entries. The task or workflow reads the thread with a table context or step on the
  comment table filtered by `thread_id`, and posts back with a commit workflow that creates a comment
  with the same `thread_id` (see [rows an agent wrote](comment-thread.md#rows-an-agent-wrote)).

Use [`comment_thread`](comment-thread.md) instead when comments belong in an activity timeline with
other events, or need attachments, a comment count or notifications from the app's own workflow:
role comments show only comments and run no app workflow when posted.
