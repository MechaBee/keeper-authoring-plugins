# AI Task Reference

An AI task lets a person ask AI to do a piece of work in the app: draft a revision, summarise a
thread, write a document, localise copy. One file at `agents/{taskId}.yaml` declares it with
`kind: task`. The AI never writes records itself. Keeper gives it a scoped context, checks what it
returns against the declared output, and saves it through the task's paired **commit workflow** on
the [`agent` channel](../security/mutations.md).

```yaml
id: draft_copy_revision
title: Draft copy revision
description: Rewrites the copy to address open review comments.   # optional, shown in the dialog
kind: task
allowed_roles: [editor, admin]            # optional; default [editor, admin]
input:                                    # workflow input_fields grammar (+ input_sections)
  - {id: version_id, type: reference, label: Version, referenceTable: creative_versions, required: true}
target: {table: creative_versions, id: {bind: input.version_id}}   # optional; runs show on this record
context:
  version:  {kind: record, table: creative_versions, id: {bind: input.version_id}}
  creative: {kind: record, table: creatives, id: {bind: context.version.creative_id}}
  comments: {kind: table, table: review_comments, filter: {version_id: {bind: input.version_id}}, limit: 50}
guide: ai/draft-copy-revision.md
executor: {kind: inline}                  # inline | agent
output:
  records:
    version:     {table: creative_versions, fields: [headline, body, cta]}
    resolutions: {table: comment_resolutions, many: true, max: 50, fields: [comment_id, note],
                  constraints: {comment_id: {in: context.comments}}}
commit: {mode: on_result, workflow: commit_ai_copy_revision}
limits: {timeout_s: 120}
```

## Parts

| Part | Rules |
| --- | --- |
| `input` | Same grammar as workflow `input_fields`. Values the person enters when starting the task. |
| `target` | Optional `{table, id}` binding `input.*` or `context.<record>.id`. The [runs component](../views/components/agent-task-runs.md) lists runs by target. |
| `context` | What the AI may read, resolved with the **requester's** row access. `record`: `{table, id}`; an empty id is an absent record (the AI sees `null`), a missing one fails the run. `table`: `{table, filter?, sort?, limit}`, where `limit` (1–500) is required. Agent executor only: `file` `{path, under?}`, `files` `{from, field, limit, under?}` (paths from a table context's rows), `folder` `{path, under, pattern?, exclude?, limit}` (every text file below a folder, `limit` 1–20), `documents` (a [document collection's](#documents) documents with their text). Bindings: `input.*`, `system.nowIso`, `context.<earlier record>.<field>`; no cycles. |
| `guide` | Required `ai/<name>.md` in the app folder: how to do the job well. |
| `executor` | `inline`: one structured generation, no tools; use for most tasks. `agent`: a focused agent that may read context files and write output files. No model key: models are chosen by the service. |
| `output` | Declared records (`table`, `op: create/update`, `id` for updates, `many` + `max`, `fields`, `constraints.<field>.in: context.<tableAlias>`), files (`path` template, `under?`, `format: markdown`, `max_bytes`; `many` + `keys_from` + `{key}`) and [documents](#documents) (`op: create/revise`). Fields must be writable: no primary key, readonly or computed fields. |
| `commit` | Who triggers the save (below). |
| `limits` | `timeout_s`: inline ≤ 300, agent ≤ 3600. Optional `max_output_tokens`. |

File path templates may use `{app.id}`, `{run.id}`, `{context.<record>.<field>}` (one path segment:
letters, digits, `_ . -`; numbers render as digits) and, for many files, `{key}`. A template may
**start** with `{path:context.<record>.<field>}` to write inside a folder a record holds (for example
`{path:context.proposal.folder_path}/drafts/draft v{context.proposal.next_draft_no}.md`); it then
requires `under`, and the rendered path must stay inside it. Paths are relative `.md` workspace
paths outside `keeper/` and `.keeper`. Keeper allocates them before the AI runs and refuses a path
that already exists.

### What people see before a run

- Every context may set `label` (what the start dialog calls it, for example `Customer documents`)
  and `required: true` (an empty result blocks the start with `context_empty`).
- The start dialog shows **The AI will read**: one line per context, resolved as the person right
  now (a record's display value, a row count, file names, skipped non-text files). A required
  context that comes back empty, or a path outside its `under`, is shown there and disables the
  start; starting refuses the same way.
- Agent tasks always open this dialog, even without visible inputs, because a run takes minutes and
  is billed. Inline tasks without inputs start straight away.

### Reading files safely

- **Set `under` whenever a path comes from data.** A record field or an input can hold any path in
  the owner's workspace; `under` (a literal folder) confines it, and a path outside it fails the
  run with `context_path_not_allowed` instead of being read (at start, before a run exists). `folder` requires it; verification
  warns (`TASK_CONTEXT_PATH_UNCONFINED`) on a data-driven `file` or `files` without it.
- **Text sources only.** The AI reads `.md`, `.markdown` and `.txt`. Other files in a `folder` are
  skipped, and a `file`/`files` path to them is left out. Ask people to convert PDFs and Word files
  to markdown and put them in the folder; say so in the app's user guide.
- `folder` lists files in path order; `pattern` and `exclude` are globs relative to the folder
  (`**` spans folders, `*` stays in one, `{md,txt}` alternates). Exclude the AI's own output
  folder (`drafts/**`) so it does not read its earlier drafts as customer material.
- A guide can tell the agent when to refuse; an agent task then ends with the agent's one-line
  reason ("The folder has no customer documents.") instead of a result.

## Documents

In an app with [document collections](../schema/roles.md), a task reads and writes documents through
the collections instead of paths.

```yaml
context:
  opportunity: {kind: record, table: opportunities, id: {bind: input.opportunity_id}}
  documents:
    kind: documents
    record:                                  # or document: <id binding>, or collection: <id binding>
      table: opportunities
      id: {bind: input.opportunity_id}
      collection_field: collection_id        # the record's own collection
      link_table: opportunity_documents      # and what is linked to it
    link_roles: [template, reference]        # optional, with record: only these links
    limit: 20                                # 1–20
output:
  documents:
    draft:
      op: create
      collection: {bind: context.opportunity.collection_id}
      subfolder: working                     # optional
      fields: [summary]                      # document fields the AI fills; create always has title
      max_bytes: 262144
  records:
    handover: {table: opportunity_comments, fields: [body]}
commit: {mode: on_result, workflow: commit_drafted_document}
```

- **Reading.** Give exactly one of `document`, `collection` or `record`. Each collection is synced
  first, so files people or other tools put in the folder are included; only active documents count.
  The AI gets the rows in `records.<alias>`, their text as files, and for each how it came in:
  `document`, `collection`, `own` (the record's own collection) or `link`, with the link's role and
  note. Agent executor only.
- **Writing.** The AI returns each document in its result: `records.<alias>.body` (the whole
  Markdown text) with `title` (create) and the declared `fields`. It does not write files. When the
  result is saved, Keeper writes the documents first, then runs the commit workflow, where
  `result.<alias>` is the written document: `id`, `title`, `path`, `revision`, `collection_id` and
  the declared fields.
  - `create` names the file after the title in the collection (or its `subfolder`), never over
    another file.
  - `revise` replaces the document's text. It is accepted only if the document still has the text
    the AI read; otherwise the run ends `conflict` (`document_changed`) with the lines someone
    changed. For `on_approval`, the review shows the AI's changes line by line and says when
    acceptance would be refused.
  - If the commit workflow then fails, created documents are removed and revisions put back.
- **Permission.** The requester must be able to edit the collection's documents, and the collection
  must have the `agent_tasks` feature on when the collections table offers it. Otherwise the start
  is refused (`document_output_denied`), already in the start dialog.
- Not available with `by_agent` commits. Verification checks the selectors
  (`TASK_DOCUMENTS_SELECTOR_INVALID`), that the app has collection and document tables
  (`TASK_DOCUMENTS_ROLE_MISSING`) and that output fields are writable.

## Commit modes

| `commit.mode` | Save happens | Use when |
| --- | --- | --- |
| `on_result` | as soon as the result passes checks | the app already reviews what gets saved (for example new versions that people approve) |
| `on_approval` | after the requester or an app admin accepts the proposal | the app has no review step of its own |
| `by_agent` | each time the agent commits a finished unit to a declared commit point | independent units should land as they finish; there is **no rollback** of landed commits |

`by_agent` needs `executor: agent`, forbids a top-level `output`, and declares points:

```yaml
commit:
  mode: by_agent
  max_commits: 6                          # required cap for the whole run
  points:
    market_version:
      workflow: commit_ai_market_version  # a commit workflow per point
      max: 3
      output:
        records: {version: {table: creative_versions, fields: [creative_id, market, headline]}}
        files: {note: {path: "docs/{app.id}/localization/{run.id}/{key}.md", format: markdown,
                       max_bytes: 50000, many: true, keys_from: input.markets}}
```

## Commit workflow

A normal [workflow](workflow.md) with `agent_commit`, paired both ways with one task (and one point
for `by_agent`):

```yaml
id: commit_ai_copy_revision
title: Save AI revision
agent_commit: {task: draft_copy_revision}
input_fields: []
steps:
  - {id: base, kind: get_record, table: creative_versions, record_id: {bind: system.agentRun.input.version_id}}
  - id: version
    kind: create_record
    table: creative_versions
    values_from: {bind: result.version}
    values: {creative_id: {bind: step.base.creative_id}, author_kind: ai, agent_run_id: {bind: system.agentRun.id}}
  - {id: resolutions, kind: create_records, table: comment_resolutions, records_from: {bind: result.resolutions}}
result: {step: version}
```

Only commit workflows may bind `result.<alias>` (single outputs with `values_from` or
`result.<alias>.<field>`; many outputs with `records_from`; a document output's `id`, `title`,
`path`, `revision`, `collection_id` and declared fields), `result.files.<alias>.path`, and
`system.agentRun.{id, taskId, requesterId, requesterEmail, input.<field>}`. A commit workflow has no
inputs or `allowed_roles`, and no view, action set or `run_workflow` may start it. Keeper does. Set
`result` to the step that creates the main record so the run can link to it. Every table it writes
that declares `mutationPolicy.channels` must admit the task on its `agent` channel.

## Reviewing list proposals (`on_approval`)

For a `many` output the reviewer ticks the rows to keep and accepts, for example **Accept 7 of 8**;
only the ticked rows reach the commit workflow (`result.<alias>` holds the kept rows), and the run
records how many were proposed and accepted. Unticking everything rejects the proposal. The AI may
flag a doubtful row with a review hint ("looks like R-3"); a hint suggesting a drop starts that row
unticked. Tell the AI in the guide when to flag instead of silently leaving a row out.

## Starting and showing tasks

Start a task with the [`agent_task_action`](../views/providers/workspace.md) resource and show its
runs with [`agent_task_runs`](../views/components/agent-task-runs.md). The legacy
[templated-prompt agent](agent.md) and its panel cannot run tasks.

List task action sets in the view's top-level `actions` without a `placement`: the view bar gathers
them into one AI control (a direct button for one task, an **AI** menu with each task's
`description` for two or more) that spins while a run on the page is active. Pin a task with
`placement: inline` only when it is the view's main job.

## Expose a task to connected agents

Add `exposure: {mcp: true}` to opt an existing task into Workspace Content MCP discovery. Omission
keeps it private to managed execution. This selects a delivery channel; existing `executor`, app
access and `allowed_roles` still apply. Exposed tasks support `on_result` and `on_approval`;
`by_agent` is rejected. The external agent performs its own reasoning without managed job billing.

Use the same context, guide, record output and commit workflow grammar. Records stay logical for
both JSONL and DynamoDB. Document outputs must include `{run.id}` in every path template. External
writes use standard workspace existence checks and upserts, without atomic create-only semantics;
Keeper records verified version/hash receipts. Drafts are retained after cancellation, rejection
or expiry. Source comparisons are best effort, and workflow commits retain their existing
concurrency guarantees. Uncertain effects are never automatically retried. Do not promise atomic
file-plus-record saves or automatic cleanup. Reference input options initially support unfiltered
reference inputs only.

The complete example is [Proposal Studio](../../examples/proposal-studio/README.md); its
ordinary workspace documents are in that example's `workspace/` folder.
`on_approval` tasks need an `agent_task_runs` component bound to their target for existing UI review.
