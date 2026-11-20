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
`operation` (`create` or `update`), and at least one `recipientFields` entry (unless it is a
channel-only rule; see [Channel-only rules](#channel-only-rules-team-feeds)). Each recipient
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
    action: Answer
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
- **`action`** (asks only, optional, up to 24 characters) is the verb on the ask's button in
  Messages and in its email: "Answer", "Review", "Approve". The button opens `link`, where the
  person sees the record and acts in the app. Without it the button says "Open".
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

### Team channels

App managers can connect a topic to a Discord channel on the app's manage page. A channel
message names the record and every person it concerns, by role, with a link to the record:

> **Review: ISS#1 Board cards show the assignee**
> **Waiting on** Kim Lee and Sam Park · **Reviewer** Kim Lee · **By** Writer for Ana Diaz
> *Issues*

- The title is the ask's `action` (or the topic's label) and the record's name: its table's
  `referenceLabelTemplate`, else its display field. The app name is the footer. An ask whose
  record has a name shows no description: the title says what to do. Without a name the topic's
  `description` explains it.
- People appear as fields under their role, by full name, never email; past two names the rest
  are counted ("and 3 others"). Every message names who acted (**By**; "Writer for Ana Diaz" when
  an agent acted for a person), an ask names who it is **Waiting on**, and a comment reply names whom
  it is **Replying to**. The app adds its own roles with `channels.people`.
- Links name the workspace owner by an opaque key, never by email: a channel may be read by
  people the workspace is not shared with, and the link opens only for those it is.
- When the ask is answered, the same message turns grey and reads in the past tense: "Reviewed:
  ISS#1 …", "Reviewed by Kim Lee". A topic without an `action` says "Done".
- What was said stays in Keeper: no comment text, descriptions or other fields beyond the
  record's name. An update topic whose messages are written to be shared, such as release
  announcements, opts in to carrying its text:

```yaml
  - id: shipped
    kind: update
    label: Shipped
    link: {view: issue, route: {issueId: "{id}"}}
    post: {table: issues, recipientFields: [author_user_id, assignee_user_id]}
    channels: {include_text: true, title: "{ref} {title}"}
```

- **`channels.include_text`** (update topics only): the channel shows the post's text, or a
  rule's inbox line, in place of the description. Asks never carry text.
- **`channels.title`** (optional, any topic, up to 120 characters): how the channel names the
  record, with `{field_id}` placeholders from it, in place of the reference label, for example
  "Shipped: TTR#19 Week labels". Only put fields there the whole channel may see.
- **`channels.people`** (optional, any topic, 1–3 entries): the people the record names, each a
  `keeper_principals` reference (single or multiple) on every table a rule of the topic watches,
  shown under its `label`. Name the roles a team needs to know whom it concerns:

  ```yaml
      channels:
        title: "{task_code} · {title}"
        people: [{field: assignee_user_id, label: Step owner}, {field: reviewer_user_id, label: Reviewer}]
  ```
- **Agent team reports.** An app admin can point an agent team's job description (Manage → Agent
  teams) at any update topic. Each finished team run then also reaches that topic's channel: the
  team and procedure as the title, with the run's summary only when the topic sets
  `include_text`. Declare such a topic (for example `agent_reports`) when a team should report to
  the channel; it needs no rules.
- A post to a topic with a connected channel goes to the channel even when nobody else follows
  the record.

#### Channel-only rules (team feeds)

A rule without `recipientFields` reaches no inbox: it only feeds the channels connected to its
topic. Use it for what a team follows rather than one person, such as new comments or step
assignments. It needs a `topic`, which must be an update topic, and takes no `delivery`,
`priority`, `message.inbox` or `message.push`.

```yaml
topics:
  - id: task_discussion
    kind: update
    label: Task discussion
    link: {view: task, route: {taskId: "{task_id}"}}
    channels: {include_text: true}
rules:
  - id: task_commented
    topic: task_discussion
    table: task_comments
    operation: create
    message:
      channel: "{body}"
```

- **`message.channel`** (one line, up to 240 characters, any rule whose topic sets
  `include_text`): the channel text in place of the inbox line. Its `{field_id}` placeholders may
  also read `textarea` fields. A channel shows the gist: the first paragraph, cut at a sentence
  once it passes about 400 characters, with "…" when there is more; the link opens the rest. A
  rule with recipients can set both: `inbox` for the person, `channel` for the team.
- **Write the outcome first.** A comment a workflow writes for an agent reaches the channel by its
  first paragraph, so put what happened there ("Published: live at …") and the audit trail
  (authorization, hashes, file paths) in later paragraphs.
- **Comments are named after their record.** On a `role: comment` table, the channel title is the
  commented record's name ("CP-001 · Pricing page"), not the comment, unless the topic sets
  `channels.title`. Comments added in the Discussion or Review panels notify like any other write.
- Nothing reaches the channel until a manager connects the topic, so a team feed is quiet by
  default. Keep a person's own copy as an ask on another topic with recipients, so it waits in
  their inbox.

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
