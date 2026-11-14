# `agent_task_runs` Component

```yaml
kind: agent_task_runs
title: AI activity                # optional
table: creative_versions
record_id: {bind: route.version_id}
tasks: [draft_copy_revision]      # optional filter; default every task targeting the table
presentation: {variant: inline}   # optional; card (default) | inline
empty_message: No agent runs yet.  # optional; card only
```

Lists the AI task runs on one record, newest first: status, requester, time, summary, and for
`by_agent` runs the number of commits. While a run is active, it shows the latest progress note and
lets the requester cancel. For `on_approval` tasks it holds the proposal review (rows of a list output can be unticked
before accepting, and the AI's review hints show under their row): the requester or
an app admin who can read everything the AI read sees **Review**, with Accept and Reject.

Required: `table` and a bound or literal `record_id`. Each `tasks` entry must be an AI task. The
component renders nothing when the record has no runs, and nothing for grant-link viewers. A card
with `empty_message` shows that text instead: use it when the card has a place of its own, such as
a tab, where nothing at all would look broken. Long summaries fold to a few lines with More.

`presentation.variant: inline` drops the card for one quiet line per run that still needs
attention: running (with Cancel), ready to review (Review opens the proposal in place), or the
latest run failed or its agent team stopped on its own, with the team's reason (both dismissible
for the session). A saved run shows "saved" for a minute, then the record itself is the result;
rejected runs and runs a person cancelled are not shown. The requester is named
only when it is someone other than the viewer. Use it where the record already shows what the AI
wrote, such as an `on_result` task that fills the record on screen; keep the card where reviewing
proposals is the main job. With nothing to report it renders nothing, so a stack leaves no gap.

The two variants work together on one record: an inline line above the content says what needs
attention now, and a card with every run sits on its own tab:

```yaml
layout:
  kind: stack
  children:
    - component: issue_main
    - component: agent_status        # agent_task_runs, presentation: {variant: inline}
    - kind: tabs
      tabs:
        - {id: conversation, label: Conversation, layout: {component: conversation}}
        - {id: agent_runs, label: Agent runs, layout: {component: agent_runs}}   # card + empty_message
```

Components on the same record share one update loop, so the pair costs no more than one. It
updates while a run is active, for up to ten minutes after the page opens, a run starts, or the
viewer refreshes. If a run is still active after that, the component says updates are paused.
The card's refresh button (and Refresh on a paused inline line) checks again, which also finds
runs other people or agents started. There is nothing to configure.
