# Copy Buttons

Add a copy button when people regularly carry text from the app into another tool and would
otherwise retype or hand-edit it: a prompt for a coding-agent session, a CLI command, a reply
template, a ticket or branch reference. The button fills in what the screen already knows, so the
reader pastes it unchanged. If the text only needs reading in the app, show it in a field or guide
instead; if the app itself should act, use an action or workflow.

Place each button on the object it is about, and only where its values are known: a record's
detail for record-specific text, the View Bar for text about the current screen. One small set per
object is enough; move rarely used ones to **More actions** with `placement: overflow`. Hide a
button with `visible_when` when its text would be wrong for the record's state (an archived
record), not merely when a reader cannot complete what follows; the receiving side should still
enforce its own rules.

Keep the text short, plain and complete: it is copied exactly as written. Fill every value from a
binding (record ids, names, `context.workspaceId`, `context.agentId`, `context.appId`) rather than
leaving blanks for the reader. Template text is readable by everyone who opens the app, so it must
not contain secrets.

## When the text is an agent prompt

- Give the agent exact ids, not discovery: name the agent, workspace and app by their ids and tell
  it to use them in every call, skipping `agent_list`, `workspace_list` and `app_list` unless a call
  with them is refused. Every tool takes the ids directly, so the listing calls only cost round
  trips. When the prompt is about a record, name the shared view and its parameter
  (`app_view_read`, viewId `issue`, params `{"issueId": "${issue_id}"}`) so the first call reads it.
- Point the agent at the app's procedures, not at memory: let it list them (`app_procedure_list`)
  and read the procedure guide. Never restate what that guide already says; the prompt goes stale
  when the guide changes, the guide does not.
- Name records by stable ids (the record id, a short slug), not by position or a copied snapshot.
  Ask the agent to read current state, because pasted facts are stale by the next visit.
- Make the agent check in: show what it will record or do, and wait for the reader's OK before it
  writes. Tell it to report a refusal instead of guessing a fix.
- Keep app knowledge in the app. The prompt belongs to the app's templates; no plugin command or
  skill text should be added for a single app.
- End with an optional line the reader can edit (a status, a due date) instead of asking them to
  splice text into the middle.

Read the [copy button reference](../reference/views/copy-text.md) for syntax, placeholders and
diagnostics.
