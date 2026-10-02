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
event. When one transaction matches several rules for the same record and recipient, only the
highest `priority` (0–100, default 0) wins; ties use file order. The inbox displays message
content only after Keeper rechecks the recipient's current row access.

Keeper validates the file against the app's tables, fields, and workflows. The file is live app
content outside the deployed definition revision. For an installed DynamoDB app, a
notification-only authoring upload follows the ordinary validate, diff, prepare, and apply
workflow but applies without a DynamoDB deployment job when the compiled app definition is
unchanged. The server reads the current file for each committed mutation and records its
revision with the resulting event.
