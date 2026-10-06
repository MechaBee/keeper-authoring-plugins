# Proposal Tracker — Exposed AI Task Example

A small sales app whose one AI task, **Draft proposal**, is exposed to connected agents through the
Workspace Content plugin (`exposure: {mcp: true}`). The connected agent does the writing with its
own model; Keeper freezes the task's context, validates the result, and holds it for review. It
runs on JSONL storage; the manifest omits `storage`.

## What's in it

| File | Shows |
| --- | --- |
| [agents/draft_proposal.yaml](agents/draft_proposal.yaml) | `kind: task` with `exposure: {mcp: true}`: a reference input, record and file context, a record output, a `{run.id}` document output path, and `commit: {mode: on_approval}` |
| [ai/draft-proposal.md](ai/draft-proposal.md) | The task guide the agent reads before working |
| [workflows/commit_proposal.yaml](workflows/commit_proposal.yaml) | The `agent_commit` workflow that saves an accepted result |
| [views/opportunities.yaml](views/opportunities.yaml) | A `record_table` plus the `agent_task_runs` card where a reviewer accepts or rejects the run |
| [schemas/](schemas/) and [data/](data/) | Two tables (customers, opportunities) and one example record each |
| [docs/guide.md](docs/guide.md) | End-user help |
| [workspace/](workspace/) | Ordinary workspace documents the task reads: a requirements input and a proposal template. They are **not** part of the app package |

## Try it

1. Install the app files (everything except `README.md` and `workspace/`) as a Keeper app through
   the normal [author-and-update](../../workflows/author-and-update.md) and
   [apply](../../workflows/apply.md) workflows.
2. Copy the contents of `workspace/` to the same workspace root, so `proposals/inputs/` and
   `proposals/templates/default.md` resolve. Upload them as workspace content; they are not app
   data.
3. From the Workspace Content plugin, list tasks, read `draft_proposal`, select `opportunity_1`, and
   prepare a run. Read its two document sources, write the declared `proposal` output, and submit
   its receipt ID with `records.opportunity.proposal_summary`.
4. The run waits for review in the app's run card. Accept it to save the summary.

Omitted storage selects JSONL. The same task works with a deployed DynamoDB app; the agent's record
and result contract does not change. Use the app-authoring deployment tools for installation and
storage conversion rather than editing physical data files through the content plugin.

Read the [task reference](../../reference/automation/task.md) and the
[`agent_task_runs` component](../../reference/views/components/agent-task-runs.md) before adapting
it. For a managed (Keeper-run) task instead of an exposed one, start from the
[AI task pattern](../patterns/ai-task.md).
