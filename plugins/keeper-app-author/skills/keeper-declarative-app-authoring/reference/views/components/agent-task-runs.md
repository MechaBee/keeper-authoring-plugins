# `agent_task_runs` Component

```yaml
kind: agent_task_runs
title: AI activity                # optional
table: creative_versions
record_id: {bind: route.version_id}
tasks: [draft_copy_revision]      # optional filter; default every task targeting the table
presentation: {variant: inline}   # optional; card (default) | inline
```

Lists the AI task runs on one record, newest first: status, requester, time, summary, and for
`by_agent` runs the number of commits. While a run is active, it shows the latest progress note and
lets the requester cancel. For `on_approval` tasks it holds the proposal review (rows of a list output can be unticked
before accepting, and the AI's review hints show under their row): the requester or
an app admin who can read everything the AI read sees **Review**, with Accept and Reject.

Required: `table` and a bound or literal `record_id`. Each `tasks` entry must be an AI task. The
component renders nothing when the record has no runs, and nothing for grant-link viewers.

`presentation.variant: inline` drops the card for one quiet line per run that still needs
attention: running (with Cancel), ready to review (Review opens the proposal in place), or the
latest run failed (dismissible for the session). A saved run shows "saved" for a minute, then the
record itself is the result; rejected and cancelled runs are not shown. The requester is named
only when it is someone other than the viewer. Use it where the record already shows what the AI
wrote, such as an `on_result` task that fills the record on screen; keep the card where reviewing
proposals is the main job. With nothing to report it renders nothing, so a stack leaves no gap.
