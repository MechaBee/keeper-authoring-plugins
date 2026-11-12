# Commit Notifications

An app can include `notifications.yaml` beside `app.yaml`. Omit the file when the app should
produce no notifications. Do not put `notifications` in `app.yaml`; Keeper rejects that key.

```yaml
rules:
  - id: issue_assigned
    table: issues
    operation: update
    changedFields: [assignee_user_id]
    recipientFields: [assignee_user_id]
    delivery: inbox_and_push
    priority: 90
    message:
      inbox: "{ref} was assigned to you."
      push: "An issue was assigned to you."
```

The file contains at most 32 rules. Each rule needs a unique `id`, a schema `table`, an
`operation` (`create` or `update`), and at least one `recipientFields` entry. Each recipient
field must be a single reference to `keeper_principals` on the changed record. For updates,
`changedFields` matches when any named field actually changes. `workflowIds` limits matches to
the named workflows; without it, direct edits can match. Split distinct transitions into
separate rules, such as `close_issue` and `reopen_issue`, when their wording differs.

`message.inbox` is optional one-line plain text, at most 240 characters. `{field_id}` inserts
the committed record's text, number, or select field value. The rendered result is bounded and
saved with the event, so later edits do not rewrite old notifications. `message.push` is
optional **static** one-line plain text, at most 120 characters. It cannot use placeholders:
browser notifications can appear on a lock screen. Without a message, Keeper uses generic copy.

`delivery` defaults to `inbox_and_push`; `inbox` disables push by default. Each member's push
subscription and preferences still govern actual delivery. The actor never receives their own
event, with one exception: when an agent writes on a person's behalf through a procedure, that
person still receives the agent's **ask** topics (see below), because the agent is asking them. When one transaction matches several rules for the same record and recipient, only the
highest `priority` (0–100, default 0) wins; ties use file order. The inbox displays message
content only after Keeper rechecks the recipient's current row access.

## Topics: asks and updates

`topics` groups rules into named message streams and gives each message a link to the view
where the recipient acts on it. Rules without `topic` keep working as above.

```yaml
topics:
  - id: questions
    kind: ask
    label: Questions from agents
    open_while: {field: status, equals: open}
    link: {view: question, route: {questionId: "{id}"}}
  - id: progress
    kind: update
    label: Agent progress
    link: {view: project, route: {projectId: "{project_id}"}}
    post: {table: checkpoints, recipientFields: [project_owner_user_id]}

rules:
  - id: question_asked
    topic: questions
    table: questions
    operation: create
    recipientFields: [asked_user_id]
    message: {inbox: "{title}"}
```

- **`kind: ask`** is something a person must do: answer, choose, review. It needs `open_while`
  (`{field, equals}` or `{field, in: [...]}`) on the rule's table. Keeper sends the ask only while
  the record is open, and marks every inbox item for it **resolved** as soon as an update moves
  the record out of that state. An item also shows resolved once its recipient field no longer
  names the reader (the ask was handed to someone else). Whoever raised the ask (the person who
  wrote the record, usually through their agent) then gets one inbox-only item saying it no
  longer waits, which their agent reads with `inbox_read`; it arrives already read when they
  closed the ask themselves.
- **`kind: update`** is informational ("pushed a checkpoint"). It has no `open_while` and never
  resolves.
- **`link`** names a view and fills its `route_state` route keys from the record with
  `{field_id}` placeholders. Every route key must exist in that view's `route_state`, and every
  placeholder must be a field on the rule's table. When the reader cannot open the linked view,
  the inbox falls back to the record's own detail view.
- At most 16 topics; `label` up to 80 characters, `description` up to 400. Every topic needs at
  least one rule or a `post` block, and every rule's `topic` must be declared. A file with only
  postable topics may leave `rules` out.
- To address an ask, the record needs a `keeper_principals` reference naming the person, for
  example a `workflowOnly` field the asking workflow fills from the parent record's owner.

### Agent posts

An update topic with `post` takes short posts from agents instead of (or as well as) rule
messages. The agent writes the text, so the message says what the session actually did.

- **`post.table`** is the table a post is about; `link` placeholders read that table's fields.
- **`post.recipientFields`** (1–8) are `keeper_principals` reference fields on that table. The
  people they name receive the post; the poster never does.
- Only `kind: update` topics take posts. Asks always come from records, through rules.
- A procedure tells its agent to post with `post_hints` (see the AI task reference). After the
  commit, `app_run_submit` returns a hint naming the topic and the record it saved in
  `post.table`; the agent sends it with the `topic_post` tool.
- A post is plain text, up to 500 characters, and goes through the same inbox, push and
  per-recipient access checks as rule messages. The poster needs edit access and must be able
  to read the record. Each person may post at most 10 times an hour per app and topic.

### App news

Every app has a built-in topic `app` (the id is reserved). App admins post to it with
`topic_post` and no record, for example "Version 2 adds runbooks and a weekly summary". It reaches
the app owner and every active member, links to the app's default view, and allows 5 posts a day
per admin. It needs nothing in `notifications.yaml`.

Keeper validates the file against the app's tables, fields, and workflows. The file is live app
content outside the deployed definition revision. For an installed DynamoDB app, a
notification-only authoring upload follows the ordinary validate, diff, prepare, and apply
workflow but applies without a DynamoDB deployment job when the compiled app definition is
unchanged. The server reads the current file for each committed mutation and records its
revision with the resulting event.
